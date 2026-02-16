import { AppDataSource } from './data-source';

/**
 * Initialize database tables and columns safely
 * Creates tables/columns if they don't exist without dropping existing ones
 * NO MANUAL SQL NEEDED - runs automatically on server startup!
 */
export async function initDatabase() {
    try {
        console.log('🔍 Checking database schema...');

        // ===== CHECK IF USERS TABLE EXISTS =====
        const tableExists = await AppDataSource.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'users'
            );
        `);

        if (!tableExists[0]?.exists) {
            console.log('📝 Users table does not exist - creating from scratch...');
            await AppDataSource.query(`
                CREATE TABLE users (
                    id VARCHAR(255) PRIMARY KEY,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    first_name VARCHAR(255) DEFAULT 'User',
                    last_name VARCHAR(255) DEFAULT '',
                    dob DATE,
                    country VARCHAR(100),
                    gender VARCHAR(50),
                    promotional_emails BOOLEAN DEFAULT false,
                    onboarding_completed BOOLEAN DEFAULT false,
                    expertise VARCHAR(255),
                    job_title VARCHAR(255),
                    industry VARCHAR(255),
                    goal TEXT,
                    work_style VARCHAR(50),
                    problems TEXT,
                    password_hash VARCHAR(255),
                    email_verified BOOLEAN DEFAULT true,
                    tier VARCHAR(50) DEFAULT 'free',
                    wins_balance INTEGER DEFAULT 100,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                );
            `);
            console.log('✅ Users table created');
            return;
        }

        // ===== CRITICAL: FIX USER ID TYPE IF NEEDED =====
        console.log('🔧 Checking user ID column type...');
        try {
            const result = await AppDataSource.query(`
                SELECT data_type, COUNT(*) as count
                FROM information_schema.columns 
                WHERE table_name = 'users' AND column_name = 'id'
                GROUP BY data_type;
            `);

            const hasInteger = result.some((r: any) => r.data_type === 'integer');

            if (hasInteger && result.length > 1) {
                console.log('⚠️  CRITICAL: Multiple id columns detected - using init script is safer than auto-migration');
                console.log('ℹ️  Please run: node simple-fix.js');
                return;
            }

            if (result[0]?.data_type === 'integer' && result.length === 1) {
                console.log('⚠️  CRITICAL: users.id is INTEGER, converting to VARCHAR for Supabase UUIDs');

                // Step 1: Check if there are any users with data
                const userCount = await AppDataSource.query(`SELECT COUNT(*) as count FROM users;`);
                const hasData = parseInt(userCount[0]?.count || '0') > 0;

                if (hasData) {
                    console.log(`⚠️  WARNING: ${userCount[0].count} users exist - this migration will preserve data`);
                }

                // Step 2: Drop known foreign key constraints (will be auto-recreated)
                const dropConstraints = [
                    `ALTER TABLE refresh_tokens DROP CONSTRAINT IF EXISTS FK_refresh_tokens_user CASCADE;`,
                    `ALTER TABLE refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_user_id_fkey CASCADE;`,
                    `ALTER TABLE vault_items DROP CONSTRAINT IF EXISTS FK_vault_items_user CASCADE;`,
                    `ALTER TABLE style_guides DROP CONSTRAINT IF EXISTS FK_style_guides_user CASCADE;`,
                    `ALTER TABLE generation_jobs DROP CONSTRAINT IF EXISTS FK_generation_jobs_user CASCADE;`,
                    `ALTER TABLE transactions DROP CONSTRAINT IF EXISTS FK_e9acc6efa76de013e8c1553ed2b CASCADE;`,
                    `ALTER TABLE jobs DROP CONSTRAINT IF EXISTS FK_9027c8f0ba75fbc1ac46647d043 CASCADE;`,
                    `ALTER TABLE conversations DROP CONSTRAINT IF EXISTS FK_3a9ae579e61e81cc0e989afeb4a CASCADE;`,
                ];

                for (const drop of dropConstraints) {
                    try {
                        await AppDataSource.query(drop);
                    } catch (e) {
                        // Constraint might not exist, that's ok
                    }
                }

                // Step 3: Convert id column to VARCHAR
                await AppDataSource.query(`
                    ALTER TABLE users ALTER COLUMN id TYPE VARCHAR(255) USING id::VARCHAR(255);
                `);

                // Step 4: Convert foreign key columns to VARCHAR in all related tables
                const fkMigrations = [
                    { table: 'refresh_tokens', column: 'user_id' },
                    { table: 'vault_items', column: 'userId' },
                    { table: 'style_guides', column: 'userId' },
                    { table: 'generation_jobs', column: 'userId' },
                    { table: 'transactions', column: 'user_id' },
                    { table: 'jobs', column: 'user_id' },
                    { table: 'conversations', column: 'user_id' },
                ];

                for (const { table, column } of fkMigrations) {
                    try {
                        await AppDataSource.query(`
                            ALTER TABLE ${table} ALTER COLUMN ${column} TYPE VARCHAR(255) USING ${column}::VARCHAR(255);
                        `);
                        console.log(`✅ Converted ${table}.${column} to VARCHAR`);
                    } catch (e) {
                        // Table/column might not exist, that's ok
                    }
                }

                console.log('✅ users.id converted to VARCHAR successfully');
            } else {
                console.log('✅ users.id already VARCHAR type');
            }
        } catch (err: any) {
            console.error('❌ Error fixing user ID type:', err.message);
            console.log('⚠️  Server will continue but login may fail for existing users');
        }

        // ===== USERS TABLE MIGRATIONS =====
        const userColumnMigrations = [
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS tier VARCHAR(50) DEFAULT 'free';`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS wins_balance INTEGER DEFAULT 0;`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS expertise VARCHAR(255);`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS job_title VARCHAR(255);`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS industry VARCHAR(255);`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS goal TEXT;`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS work_style VARCHAR(50);`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS problems TEXT;`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS promotional_emails BOOLEAN DEFAULT false;`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS dob DATE;`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS country VARCHAR(100);`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(50);`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);`,
        ];

        console.log('📝 Updating users table...');
        for (const migration of userColumnMigrations) {
            try {
                await AppDataSource.query(migration);
            } catch (err: any) {
                // Ignore "already exists" errors
                if (!err.message?.includes('already exists')) {
                    console.log('⚠️  Migration note:', err.message);
                }
            }
        }
        console.log('✅ Users table schema updated');

        // ===== EARLY ACCESS TABLE =====
        console.log('📝 Creating early_access table...');
        await AppDataSource.query(`
            CREATE TABLE IF NOT EXISTS early_access (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(255) NOT NULL,
                last_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);

        await AppDataSource.query(`CREATE INDEX IF NOT EXISTS idx_early_access_email ON early_access(email);`);
        await AppDataSource.query(`CREATE INDEX IF NOT EXISTS idx_early_access_status ON early_access(status);`);
        await AppDataSource.query(`CREATE INDEX IF NOT EXISTS idx_early_access_created_at ON early_access(created_at);`);
        console.log('✅ Early access table initialized');

        // ===== REFRESH TOKENS TABLE =====
        console.log('📝 Checking refresh_tokens table...');
        const refreshTokenMigrations = [
            `ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS user_id VARCHAR(255);`,
            `ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS device_name VARCHAR(255);`,
            `ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45);`,
            `ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS user_agent TEXT;`,
            `ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS last_active TIMESTAMP DEFAULT NOW();`,
            `ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS revoked BOOLEAN DEFAULT false;`,
        ];

        for (const migration of refreshTokenMigrations) {
            try {
                await AppDataSource.query(migration);
            } catch (err: any) {
                if (!err.message?.includes('already exists')) {
                    console.log('⚠️  Migration note:', err.message);
                }
            }
        }
        console.log('✅ Refresh tokens table updated');

        console.log('✅ ALL DATABASE MIGRATIONS COMPLETE - No manual SQL needed!');
    } catch (error) {
        console.error('❌ Error initializing database:', error);
        console.log('⚠️  Server will continue but some features may not work');
        // Don't throw - let the app continue
    }
}

