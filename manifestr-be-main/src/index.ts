// Load environment variables FIRST (using require to ensure it runs before any imports)
require('dotenv').config();

import 'reflect-metadata';
import App from './app';
import { AppDataSource } from './lib/data-source';

AppDataSource.initialize()
  .then(async () => {
    const app = new App();
    app.listen(() => {
      console.log(`App is running on port ${app.port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize data source', error);
    process.exit(1);
  });
