# Production Database Fix

## Problem
TypeORM's `synchronize: true` was trying to automatically modify database schema on production server, causing conflicts with existing foreign key constraints.

## Solution

### Step 1: Update Production Environment Variable

On your **production server**, add this to your `.env` file:

```bash
NODE_ENV=production
```

This will disable automatic schema synchronization in production.

### Step 2: Run Migration Manually

Connect to your production database and run the migration:

```bash
# SSH into your server
ssh ubuntu@your-server

# Connect to PostgreSQL
psql -U postgres -d manifestr

# Or if using Supabase DATABASE_URL
psql postgresql://postgres:PASSWORD@HOST:5432/postgres

# Run the migration
\i /home/ubuntu/apps/manifestr/manifestr-be-main/migrations/001_create_early_access_table.sql
```

**OR** run the SQL directly:

```sql
CREATE TABLE IF NOT EXISTS early_access (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_early_access_email ON early_access(email);
CREATE INDEX IF NOT EXISTS idx_early_access_status ON early_access(status);
CREATE INDEX IF NOT EXISTS idx_early_access_created_at ON early_access(created_at);
```

### Step 3: Restart Your Server

```bash
# Using PM2
pm2 restart manifestr-api

# Or if using systemctl
sudo systemctl restart manifestr-api
```

### Step 4: Verify

Check that the server starts without errors:

```bash
pm2 logs manifestr-api
```

You should see: `App is running on port 8000`

## What Changed

**Before:**
```typescript
synchronize: true, // Always auto-sync (DANGEROUS in production!)
```

**After:**
```typescript
synchronize: process.env.NODE_ENV !== 'production', // Only auto-sync in development
```

## Testing

Test the early access endpoint:

```bash
curl -X POST https://your-domain.com/early-access/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com"
  }'
```

## Important Notes

⚠️ **NEVER use `synchronize: true` in production!**

It can:
- Drop tables
- Delete data
- Break foreign key constraints
- Cause downtime

Always use migrations for production schema changes.

## Future Schema Changes

For any future database schema changes:

1. Create a migration SQL file in `/migrations/`
2. Run it manually on production
3. TypeORM will only auto-sync in development (when NODE_ENV !== 'production')

