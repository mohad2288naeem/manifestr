// SIMPLE FIX: Drop the integer ID column, keep UUID
require('dotenv').config();
const { Client } = require('pg');

const DIRECT_URL = 'postgresql://postgres:L0pjxBE7tZZCWT5H@db.buhxshqfkypquptmmdyy.supabase.co:5432/postgres';

const client = new Client({
    connectionString: DIRECT_URL,
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

            // Drop constraints
            await client.query(`ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pkey CASCADE;`);
            await client.query(`ALTER TABLE users DROP CONSTRAINT IF EXISTS PK_a3ffb1c0c8416b9fc6f907b7433 CASCADE;`);

            // Drop the integer id column (should be first one)
            const intIdPosition = columns.rows.find(r => r.data_type === 'integer')?.ordinal_position;
            if (intIdPosition) {
                // Rename uuid id temporarily
                await client.query(`ALTER TABLE users RENAME COLUMN id TO id_temp;`);
                // Now drop the integer one (it's now the only 'id' left)
                await client.query(`ALTER TABLE users DROP COLUMN IF EXISTS id;`);
                // Rename uuid back to id
                await client.query(`ALTER TABLE users RENAME COLUMN id_temp TO id;`);
            }

            // Set as primary key
            await client.query(`ALTER TABLE users ADD PRIMARY KEY (id);`);

            console.log('✅ Fixed! users.id is now UUID only');
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

