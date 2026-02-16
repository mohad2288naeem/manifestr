// Quick script to check database schema
require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL
});

async function checkSchema() {
    try {
        await client.connect();
        console.log('✅ Connected to database');

        // Check users.id column type
        const idType = await client.query(`
            SELECT data_type, character_maximum_length
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'id';
        `);

        console.log('\n📋 users.id column type:', idType.rows[0]);

        // Check if email_verified exists
        const emailVerified = await client.query(`
            SELECT column_name, data_type
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'email_verified';
        `);

        console.log('📋 email_verified exists:', emailVerified.rows.length > 0 ? 'YES ✅' : 'NO ❌');

        // Check all columns in users table
        const allColumns = await client.query(`
            SELECT column_name, data_type
            FROM information_schema.columns 
            WHERE table_name = 'users'
            ORDER BY ordinal_position;
        `);

        console.log('\n📋 All columns in users table:');
        allColumns.rows.forEach(col => {
            console.log(`  - ${col.column_name}: ${col.data_type}`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
    }
}

checkSchema();

