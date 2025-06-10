# Database Configuration

This project uses [Drizzle ORM](https://orm.drizzle.team/) with Cloudflare D1 database. However, the architecture is designed to be database-agnostic, allowing you to use any database supported by Drizzle ORM.

## Current Setup (Cloudflare D1)

The project is configured to use Cloudflare D1 by default:

1. Database initialization happens in `src/lib/server/drizzle/index.ts`
2. Schema definitions are in `src/lib/server/entity/index.ts`
3. Migrations are in the `migrations/` directory

### Setting up Cloudflare D1

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Create a D1 database:
   ```bash
   wrangler d1 create easy-rd
   ```

3. Update `wrangler.toml` with your database configuration:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "easy-rd"
   database_id = "your-database-id"
   ```

4. Run migrations:
   ```bash
   npm run migration:apply
   ```

## Using Alternative Databases

To use a different database (PostgreSQL, MySQL, SQLite, etc.):

### 1. Update Dependencies

```bash
# For PostgreSQL
npm install @neondatabase/serverless
npm install drizzle-orm/neon-http

# For MySQL
npm install mysql2
npm install drizzle-orm/mysql2

# For SQLite
npm install better-sqlite3
npm install drizzle-orm/better-sqlite3
```

### 2. Modify Database Connection

Update `src/lib/server/drizzle/index.ts`:

```typescript
// Example for PostgreSQL
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

export function drizzle(): Handle {
  return function ({ event, resolve }) {
    if (building) return resolve(event);
    
    const sql = neon(process.env.DATABASE_URL!);
    event.locals.db = drizzle(sql);
    return resolve(event);
  };
}
```

### 3. Update Drizzle Config

Modify `drizzle.config.ts` for your database:

```typescript
// Example for PostgreSQL
export default {
  schema: "./src/lib/server/entity/index.ts",
  out: "./migrations",
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  }
} satisfies Config;
```

### 4. Regenerate Migrations

```bash
# Generate new migrations for your database
npm run migration:generate

# Apply migrations
npm run migration:apply
```

## Schema Overview

The database schema includes:
- `member`: User accounts
- `project`: DBML projects
- `resource`: Project resources (code)
- `projectMember`: Many-to-many relationship for project sharing

## Best Practices

1. Always use migrations for schema changes
2. Keep business logic in the service layer, not in database queries
3. Use transactions for operations that modify multiple tables
4. Add appropriate indexes for performance

## Environment Variables

Add your database connection string to `.env`:
```
DATABASE_URL=your_connection_string_here
```