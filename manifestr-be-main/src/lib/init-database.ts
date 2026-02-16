import { AppDataSource } from './data-source';

/**
 * Initialize database tables safely
 * Creates tables if they don't exist without dropping existing ones
 */
export async function initDatabase() {
    try {
        console.log('🔍 Checking database tables...');

        // Create early_access table if it doesn't exist
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

        // Create indexes if they don't exist
        await AppDataSource.query(`
            CREATE INDEX IF NOT EXISTS idx_early_access_email ON early_access(email);
        `);

        await AppDataSource.query(`
            CREATE INDEX IF NOT EXISTS idx_early_access_status ON early_access(status);
        `);

        await AppDataSource.query(`
            CREATE INDEX IF NOT EXISTS idx_early_access_created_at ON early_access(created_at);
        `);

        console.log('✅ Database tables initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing database:', error);
        // Don't throw - let the app continue even if tables already exist
    }
}

