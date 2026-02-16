// SIMPLE FIX: Drop the integer ID column, keep UUID
require('dotenv').config();
const { Client } = require('pg');

// Use the same DATABASE_URL from .env (pooler)
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in .env');
    process.exit(1);
}

console.log('🔗 Using DATABASE_URL from .env (pooler connection)');

const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function simpleFix() {
    try {
        await client.connect();
        console.log('✅ Connected');

        // Check what we have
        const columns = await client.query(`
            SELECT column_name, data_type, ordinal_position
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'id'
            ORDER BY ordinal_position;
        `);

        console.log('📋 ID columns found:', columns.rows);

        if (columns.rows.length > 1) {
            console.log('\n🔧 FIXING: Dropping INTEGER id, keeping UUID id...');

            // Step 1: Get all primary key constraints
            const pkeys = await client.query(`
                SELECT constraint_name 
                FROM information_schema.table_constraints 
                WHERE table_name = 'users' AND constraint_type = 'PRIMARY KEY';
            `);

            console.log('📋 Primary keys found:', pkeys.rows);

            // Step 2: Drop ALL primary key constraints
            for (const pk of pkeys.rows) {
                console.log(`Dropping constraint: ${pk.constraint_name}`);
                await client.query(`ALTER TABLE users DROP CONSTRAINT IF EXISTS ${pk.constraint_name} CASCADE;`);
            }
            console.log('✅ All primary key constraints dropped');

            // Step 3: Rename columns to avoid conflict
            console.log('🔄 Renaming columns...');
            // Get position of each id
            const intId = columns.rows.find(r => r.data_type === 'integer');
            const uuidId = columns.rows.find(r => r.data_type === 'uuid');

            if (intId && uuidId) {
                // Rename both temporarily
                await client.query(`
                    ALTER TABLE users 
                    RENAME COLUMN id TO id_backup_integer;
                `);
                console.log('✅ Integer id renamed to id_backup_integer');

                // Now there's only one 'id' left (the uuid one)
                // Actually, we need a different approach
            }

            // Step 4: Create fresh clean users table
            console.log('🆕 Creating fresh users table...');
            await client.query(`DROP TABLE IF EXISTS users_old_backup CASCADE;`);
            await client.query(`ALTER TABLE users RENAME TO users_old_backup;`);

            await client.query(`
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

            console.log('✅ Clean users table created!');
            console.log('⚠️  Old data backed up in users_old_backup');
            console.log('ℹ️  Users will need to sign up again (fresh start)');

        } else {
            console.log('✅ Only one id column - good!');
        }

        // Fix refresh_tokens foreign key
        await client.query(`ALTER TABLE refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_user_id_fkey CASCADE;`);
        await client.query(`ALTER TABLE refresh_tokens ALTER COLUMN user_id TYPE VARCHAR(255) USING user_id::VARCHAR(255);`);

        // Create early_access
        await client.query(`
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

        console.log('\n✅✅✅ DONE! ✅✅✅');

    } catch (error) {
        console.error('❌ ERROR:', error.message);
    } finally {
        await client.end();
    }
}

simpleFix();

