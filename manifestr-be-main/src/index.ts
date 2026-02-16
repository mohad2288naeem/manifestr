// Load environment variables FIRST (using require to ensure it runs before any imports)
require('dotenv').config();

import 'reflect-metadata';
import App from './app';
import { AppDataSource } from './lib/data-source';
import { initDatabase } from './lib/init-database';

AppDataSource.initialize()
  .then(async () => {
    // Initialize database tables (safe - only creates if not exists)
    await initDatabase();

    const app = new App();
    app.listen(() => {
      console.log(`App is running on port ${app.port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize data source', error);
    process.exit(1);
  });
