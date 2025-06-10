# Migration Guide

This guide explains how to migrate from the default Drizzle ORM setup to another data source, or how to set up Easy RD with a different backend from scratch.

## Overview

Easy RD uses a **Resource Adapter pattern** that allows you to connect to any data source without changing the application code. The default implementation uses Drizzle ORM with Cloudflare D1, but you can easily switch to REST APIs, GraphQL endpoints, other databases, or any combination thereof.

## Migration Steps

### 1. Choose Your Data Source

First, decide what type of data source you want to use:

**Databases:**
- **PostgreSQL**: Great for production deployments
- **MySQL**: Popular choice with good tooling
- **SQLite**: Perfect for development and small deployments
- **MongoDB**: If you prefer NoSQL
- **Supabase/Neon**: Serverless PostgreSQL options

**APIs:**
- **REST API**: If you have an existing backend service
- **GraphQL**: For flexible data fetching
- **Serverless Functions**: Firebase, Supabase, AWS Lambda
- **Headless CMS**: Strapi, Directus, Sanity

**Hybrid Approaches:**
- **User Management API + Project Database**: Use Auth0/Clerk for users, database for projects
- **Multi-tenant**: Different adapters per tenant

### 2. Export Existing Data (If Migrating)

If you have existing data in Cloudflare D1, export it first:

```bash
# Export data using Wrangler
wrangler d1 export easy-rd --output=backup.sql

# Or use the Drizzle Studio
npm run drizzle-kit studio
```

### 3. Implement the Resource Adapter

Create your adapter implementation following the `ResourceAdapter` interface:

```typescript
// src/lib/server/adapter/your-adapter.ts
import type { ResourceAdapter } from './types';

export class YourAdapter implements ResourceAdapter {
  // Implement all required methods
}
```

See [resource-adapters.md](./resource-adapters.md) for detailed examples and implementation patterns.

### 4. Update Database Schema

#### For SQL Databases

Convert the Drizzle schema to your ORM's format:

**Original Drizzle Schema** (src/lib/server/entity/index.ts):
```typescript
export const member = sqliteTable('member', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  meta: text('meta', { mode: 'json' }).$type<{
    name: string;
    image: string;
  }>().notNull()
});
```

**Prisma Example**:
```prisma
model Member {
  id    String @id
  email String @unique
  name  String
  image String
}
```

**TypeORM Example**:
```typescript
@Entity()
export class Member {
  @PrimaryColumn()
  id: string;
  
  @Column({ unique: true })
  email: string;
  
  @Column()
  name: string;
  
  @Column()
  image: string;
}
```

#### For NoSQL Databases

Define your collections/documents structure:

```typescript
// MongoDB Example
const memberSchema = {
  _id: String,      // Use the existing id as _id
  email: String,
  name: String,
  image: String
};
```

### 5. Migrate Data

#### SQL to SQL Migration

1. Generate DDL from your new ORM:
   ```bash
   # Prisma
   npx prisma migrate dev --name init
   
   # TypeORM
   npm run typeorm migration:generate -- -n Init
   ```

2. Import your data:
   ```bash
   # PostgreSQL
   psql -d your_database < backup.sql
   
   # MySQL
   mysql -u root -p your_database < backup.sql
   ```

3. Transform data if needed (e.g., JSON columns):
   ```sql
   -- Example: Flatten JSON meta column
   UPDATE members 
   SET name = meta->>'name', 
       image = meta->>'image';
   ALTER TABLE members DROP COLUMN meta;
   ```

#### SQL to NoSQL Migration

Write a migration script:

```typescript
// migrate.ts
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { MongoClient } from 'mongodb';

async function migrate() {
  // Source: SQLite
  const sqlite = new Database('your-backup.db');
  const db = drizzle(sqlite);
  const members = await db.select().from(member);
  
  // Destination: MongoDB
  const mongo = new MongoClient(process.env.MONGODB_URI);
  await mongo.connect();
  const mongoDb = mongo.db('easy-rd');
  
  // Transform and insert
  const transformedMembers = members.map(m => ({
    _id: m.id,
    email: m.email,
    name: m.meta.name,
    image: m.meta.image
  }));
  
  await mongoDb.collection('members').insertMany(transformedMembers);
}
```

### 6. Update Configuration

1. Update environment variables:
   ```bash
   # .env
   DATABASE_URL=postgresql://user:pass@host:5432/dbname
   # or
   MONGODB_URI=mongodb://localhost:27017/easy-rd
   ```

2. Update the adapter handler:
   ```typescript
   // src/lib/server/adapter/index.ts
   import { YourAdapter } from './your-adapter';
   
   export function createAdapterHandler(customAdapter?: ResourceAdapter): Handle {
     return function ({ event, resolve }) {
       if (building) return resolve(event);
       
       event.locals.db = customAdapter || new YourAdapter({
         // your configuration
       });
       
       return resolve(event);
     };
   }
   ```

3. Update hooks.server.ts:
   ```typescript
   // src/hooks.server.ts
   import { createAdapterHandler } from '$lib/server/adapter';
   import { YourAdapter } from '$lib/server/adapter/your-adapter';
   
   const adapter = new YourAdapter({
     // your configuration
   });
   
   const adapterHandler = createAdapterHandler(adapter);
   ```

### 7. Test the Migration

1. Run the test suite:
   ```bash
   npm test
   ```

2. Test critical paths manually:
   - User registration/login
   - Creating projects
   - Sharing projects
   - Updating diagrams

3. Verify data integrity:
   - Check all users are migrated
   - Verify projects and their relationships
   - Ensure permissions are preserved

## Common Issues and Solutions

### Issue: JSON Data Migration

**Problem**: Drizzle stores complex data as JSON, but your new database doesn't support JSON columns.

**Solution**: Flatten the JSON structure during migration:
```sql
-- For meta column in members table
ALTER TABLE members ADD COLUMN name VARCHAR(255);
ALTER TABLE members ADD COLUMN image VARCHAR(255);
UPDATE members SET 
  name = JSON_EXTRACT(meta, '$.name'),
  image = JSON_EXTRACT(meta, '$.image');
ALTER TABLE members DROP COLUMN meta;
```

### Issue: UUID Generation

**Problem**: Different databases handle UUID generation differently.

**Solution**: Use application-level UUID generation:
```typescript
// In your adapter
import { randomUUID } from 'crypto';

async createProject(data) {
  const id = randomUUID(); // Generate in application
  // ... rest of implementation
}
```

### Issue: Date/Time Handling

**Problem**: Date formats differ between databases.

**Solution**: Always use ISO 8601 format:
```typescript
// Store dates as ISO strings
const createdAt = new Date().toISOString();

// Parse when reading
const date = new Date(row.createdAt);
```

## Rollback Plan

Always have a rollback plan:

1. **Backup before migration**: Keep your original database backup
2. **Use feature flags**: Gradually switch traffic to the new database
3. **Keep old adapter**: Don't delete the old implementation immediately
4. **Monitor closely**: Watch for errors and performance issues

```typescript
// Example: Feature flag for gradual rollout
export function createAdapterHandler(): Handle {
  return function ({ event, resolve }) {
    const useNewAdapter = event.url.searchParams.has('new_adapter');
    
    if (useNewAdapter) {
      event.locals.db = new NewAdapter();
    } else {
      event.locals.db = new DrizzleAdapter(db);
    }
    
    return resolve(event);
  };
}
```

## Performance Considerations

1. **Connection Pooling**: Ensure your new database adapter uses connection pooling
2. **Query Optimization**: Review and optimize queries for your new database
3. **Indexing**: Create appropriate indexes based on query patterns
4. **Caching**: Consider adding caching for frequently accessed data

## Next Steps

After successful migration:

1. Remove old dependencies (if no longer needed):
   ```bash
   npm uninstall drizzle-orm drizzle-kit
   ```

2. Clean up old files (if using API instead of database):
   ```bash
   rm -rf migrations/
   rm drizzle.config.ts
   rm -rf src/lib/server/entity
   rm -rf src/lib/server/drizzle
   ```

3. Update documentation to reflect the new data source setup

4. Update CI/CD pipelines with new configuration

5. Consider keeping the Drizzle adapter as a reference implementation