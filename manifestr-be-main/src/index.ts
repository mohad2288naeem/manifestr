// Load environment variables FIRST (using require to ensure it runs before any imports)
require('dotenv').config();

import App from './app';

// No TypeORM initialization needed - using Supabase directly!
const app = new App();
app.listen(() => {
  console.log(`✅ App is running on port ${app.port}`);
  console.log(`✅ Using Supabase for all database operations`);
});
