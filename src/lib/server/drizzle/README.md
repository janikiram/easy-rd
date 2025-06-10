# Drizzle ORM Configuration

This directory contains the Drizzle ORM specific implementation. Easy RD uses a Resource Adapter pattern that allows you to use any data source (databases, REST APIs, GraphQL, etc.).

## Current Setup (Cloudflare D1)

The project is configured to use Cloudflare D1 by default through the DrizzleAdapter:

1. Schema definitions are in `src/lib/server/entity/index.ts`
2. Migrations are in the `migrations/` directory
3. The adapter implementation is in `src/lib/server/adapter/drizzle-adapter.ts`

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

## Using Alternative Data Sources

Easy RD now uses a Resource Adapter pattern, making it easy to switch between different data sources. See:

- **[Resource Adapters Documentation](../../docs/resource-adapters.md)**: Learn how to implement adapters for REST APIs, GraphQL, or other databases
- **[Migration Guide](../../docs/migration-guide.md)**: Step-by-step guide for migrating to different data sources

### Quick Examples

#### PostgreSQL with Drizzle
```typescript
// src/lib/server/adapter/postgres-adapter.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { DrizzleAdapter } from './drizzle-adapter';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);
export const adapter = new DrizzleAdapter(db);
```

#### REST API
```typescript
// src/lib/server/adapter/api-adapter.ts
import { APIAdapter } from './api-adapter';

export const adapter = new APIAdapter({
  apiUrl: 'https://api.your-backend.com',
  apiKey: process.env.API_KEY
});
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

For database connections, add to `.env`:
```
DATABASE_URL=your_connection_string_here
```

For API connections:
```
API_URL=https://api.your-backend.com
API_KEY=your_api_key_here
```