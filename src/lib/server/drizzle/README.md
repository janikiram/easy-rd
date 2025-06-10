# Database Configuration

This project uses a database adapter pattern that allows you to use any database or ORM of your choice. By default, it uses [Drizzle ORM](https://orm.drizzle.team/) with Cloudflare D1 database, but you can easily switch to PostgreSQL, MySQL, MongoDB, or any other database by implementing the `DatabaseAdapter` interface.

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

The project now uses a database adapter pattern, making it easy to switch between different databases or ORMs. See the following resources:

- **[Database Adapter Examples](../../docs/database-adapters.md)**: Detailed examples for Prisma, TypeORM, MongoDB, and more
- **[Migration Guide](../../docs/migration-guide.md)**: Step-by-step guide for migrating from Drizzle to another database

### Quick Start with Different Databases

#### PostgreSQL with Drizzle
```typescript
// src/lib/server/database/index.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { DrizzleAdapter } from './drizzle-adapter';

export function createDatabaseHandler(): Handle {
  return function ({ event, resolve }) {
    if (building) return resolve(event);
    
    const sql = neon(process.env.DATABASE_URL!);
    const db = drizzle(sql);
    event.locals.dbAdapter = new DrizzleAdapter(db);
    
    return resolve(event);
  };
}
```

#### Using a Different ORM
1. Implement the `DatabaseAdapter` interface
2. Update the `createDatabaseHandler` function
3. Update your schema and migrations
4. You're done!

The adapter pattern ensures your application code remains unchanged regardless of the database you choose.

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