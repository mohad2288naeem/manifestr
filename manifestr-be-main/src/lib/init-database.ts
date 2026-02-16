import { AppDataSource } from './data-source';

/**
 * Initialize database tables and columns safely
 * Creates tables/columns if they don't exist without dropping existing ones
 * NO MANUAL SQL NEEDED - runs automatically on server startup!
 */
export async function initDatabase() {
    try {
        console.log('🔍 Checking database schema...');

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

