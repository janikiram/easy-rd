# Database Adapters (Deprecated)

> **⚠️ DEPRECATED**: This documentation is deprecated. Database Adapters have been replaced with the more flexible Resource Adapter pattern. Please see [Resource Adapters](./resource-adapters.md) for the latest documentation.
>
> The database folder (`src/lib/server/database`) has been removed in favor of the new adapter pattern (`src/lib/server/adapter`).

## Migration Notice

The Database Adapter interface has been renamed and redesigned as Resource Adapter to support not just databases, but any data source including REST APIs, GraphQL, and more.

### Quick Migration Guide

1. **Update imports**:
   ```typescript
   // Old
   import type { DatabaseAdapter } from '$lib/server/database';
   
   // New
   import type { ResourceAdapter } from '$lib/server/adapter';
   ```

2. **Update method names**:
   - `findMemberById` → `getUser`
   - `findMemberByEmail` → `getUser`
   - `createProjectMember` → `addCollaborator`
   - `deleteProjectMember` → `removeCollaborator`
   - `findProjectsByMemberId` → `listUserProjects`

3. **Update return types**:
   - Remove database-specific fields like `isDeleted`
   - Use domain models instead of database schemas

For complete migration instructions and new adapter examples, please refer to the [Resource Adapters documentation](./resource-adapters.md).

---

# Original Database Adapter Examples (Deprecated)

This document provides examples of how to implement the DatabaseAdapter interface with different ORMs and databases.

## Prisma Example

```typescript
// src/lib/server/database/prisma-adapter.ts
import type { DatabaseAdapter } from './types';
import type { PrismaClient } from '@prisma/client';
import type { Member } from '$lib/types';

export class PrismaAdapter implements DatabaseAdapter {
  constructor(private prisma: PrismaClient) {}

  async createMember(data: {
    id: string;
    email: string;
    name: string;
    image: string;
  }): Promise<Member> {
    const result = await this.prisma.member.create({
      data: {
        id: data.id,
        email: data.email,
        name: data.name,
        image: data.image
      }
    });

    return {
      id: result.id,
      email: result.email,
      name: result.name,
      image: result.image
    };
  }

  async findMemberById(id: string): Promise<Member | null> {
    const result = await this.prisma.member.findUnique({
      where: { id }
    });

    if (!result) return null;

    return {
      id: result.id,
      email: result.email,
      name: result.name,
      image: result.image
    };
  }

  // ... implement other methods
}
```

### Prisma Setup

1. Install Prisma:
   ```bash
   npm install prisma @prisma/client
   npm install -D @types/node
   ```

2. Initialize Prisma:
   ```bash
   npx prisma init
   ```

3. Define your schema in `prisma/schema.prisma`:
   ```prisma
   model Member {
     id    String @id
     email String @unique
     name  String
     image String
     
     projects ProjectMember[]
   }
   
   model Project {
     id        String   @id @default(uuid())
     name      String
     canView   Boolean  @default(true)
     canEdit   Boolean  @default(false)
     isDeleted Boolean  @default(false)
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
     
     members   ProjectMember[]
     resource  Resource?
   }
   
   model Resource {
     id        String  @id @default(uuid())
     projectId String  @unique
     code      String  @db.Text
     model     Json
     
     project   Project @relation(fields: [projectId], references: [id])
   }
   
   model ProjectMember {
     id         String  @id @default(uuid())
     projectId  String
     memberId   String
     isOwner    Boolean @default(false)
     canView    Boolean @default(true)
     canEdit    Boolean @default(false)
     canInvite  Boolean @default(false)
     
     project    Project @relation(fields: [projectId], references: [id])
     member     Member  @relation(fields: [memberId], references: [id])
     
     @@unique([projectId, memberId])
   }
   ```

4. Update your database handler:
   ```typescript
   // src/lib/server/database/index.ts
   import { PrismaClient } from '@prisma/client';
   import { PrismaAdapter } from './prisma-adapter';
   
   const prisma = new PrismaClient();
   
   export function createDatabaseHandler(): Handle {
     return function ({ event, resolve }) {
       if (building) return resolve(event);
       
       event.locals.dbAdapter = new PrismaAdapter(prisma);
       
       return resolve(event);
     };
   }
   ```

## TypeORM Example

```typescript
// src/lib/server/database/typeorm-adapter.ts
import type { DatabaseAdapter } from './types';
import type { DataSource } from 'typeorm';
import { Member } from './entities/Member';

export class TypeORMAdapter implements DatabaseAdapter {
  constructor(private dataSource: DataSource) {}

  async createMember(data: {
    id: string;
    email: string;
    name: string;
    image: string;
  }): Promise<Member> {
    const memberRepo = this.dataSource.getRepository(Member);
    const member = memberRepo.create(data);
    await memberRepo.save(member);
    
    return {
      id: member.id,
      email: member.email,
      name: member.name,
      image: member.image
    };
  }

  // ... implement other methods
}
```

### TypeORM Setup

1. Install TypeORM:
   ```bash
   npm install typeorm reflect-metadata
   npm install pg # or mysql2, sqlite3, etc.
   ```

2. Create entities:
   ```typescript
   // src/lib/server/database/entities/Member.ts
   import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
   
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
     
     @OneToMany(() => ProjectMember, pm => pm.member)
     projects: ProjectMember[];
   }
   ```

3. Configure TypeORM:
   ```typescript
   // src/lib/server/database/data-source.ts
   import { DataSource } from 'typeorm';
   
   export const AppDataSource = new DataSource({
     type: 'postgres',
     host: process.env.DB_HOST,
     port: parseInt(process.env.DB_PORT || '5432'),
     username: process.env.DB_USER,
     password: process.env.DB_PASSWORD,
     database: process.env.DB_NAME,
     synchronize: false, // Use migrations in production
     entities: ['src/lib/server/database/entities/*.ts'],
     migrations: ['src/lib/server/database/migrations/*.ts']
   });
   ```

## MongoDB Example

```typescript
// src/lib/server/database/mongodb-adapter.ts
import type { DatabaseAdapter } from './types';
import type { Db, Collection } from 'mongodb';

export class MongoDBAdapter implements DatabaseAdapter {
  private members: Collection;
  private projects: Collection;
  private resources: Collection;
  private projectMembers: Collection;

  constructor(private db: Db) {
    this.members = db.collection('members');
    this.projects = db.collection('projects');
    this.resources = db.collection('resources');
    this.projectMembers = db.collection('projectMembers');
  }

  async createMember(data: {
    id: string;
    email: string;
    name: string;
    image: string;
  }): Promise<Member> {
    await this.members.insertOne({
      _id: data.id,
      ...data
    });
    
    return data;
  }

  async findMemberById(id: string): Promise<Member | null> {
    const result = await this.members.findOne({ _id: id });
    
    if (!result) return null;
    
    return {
      id: result._id,
      email: result.email,
      name: result.name,
      image: result.image
    };
  }

  // ... implement other methods
}
```

### MongoDB Setup

1. Install MongoDB driver:
   ```bash
   npm install mongodb
   ```

2. Configure MongoDB connection:
   ```typescript
   // src/lib/server/database/index.ts
   import { MongoClient } from 'mongodb';
   import { MongoDBAdapter } from './mongodb-adapter';
   
   const client = new MongoClient(process.env.MONGODB_URI!);
   
   export function createDatabaseHandler(): Handle {
     return async function ({ event, resolve }) {
       if (building) return resolve(event);
       
       await client.connect();
       const db = client.db('easy-rd');
       
       event.locals.dbAdapter = new MongoDBAdapter(db);
       
       return resolve(event);
     };
   }
   ```

## Raw SQL Example

For simple use cases or when you need maximum control:

```typescript
// src/lib/server/database/sql-adapter.ts
import type { DatabaseAdapter } from './types';
import postgres from 'postgres';

export class SQLAdapter implements DatabaseAdapter {
  constructor(private sql: postgres.Sql) {}

  async createMember(data: {
    id: string;
    email: string;
    name: string;
    image: string;
  }): Promise<Member> {
    const [result] = await this.sql`
      INSERT INTO members (id, email, name, image)
      VALUES (${data.id}, ${data.email}, ${data.name}, ${data.image})
      RETURNING *
    `;
    
    return {
      id: result.id,
      email: result.email,
      name: result.name,
      image: result.image
    };
  }

  // ... implement other methods
}
```

## Testing Your Adapter

Create unit tests for your adapter implementation:

```typescript
// src/lib/server/database/adapter.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import type { DatabaseAdapter } from './types';

function testDatabaseAdapter(
  name: string, 
  createAdapter: () => Promise<DatabaseAdapter>
) {
  describe(`${name} DatabaseAdapter`, () => {
    let adapter: DatabaseAdapter;
    
    beforeEach(async () => {
      adapter = await createAdapter();
    });
    
    it('should create and find a member', async () => {
      const memberData = {
        id: 'test-id',
        email: 'test@example.com',
        name: 'Test User',
        image: 'https://example.com/avatar.jpg'
      };
      
      const created = await adapter.createMember(memberData);
      expect(created).toEqual(memberData);
      
      const found = await adapter.findMemberById(memberData.id);
      expect(found).toEqual(memberData);
    });
    
    // Add more tests for all adapter methods
  });
}

// Test your implementations
testDatabaseAdapter('Drizzle', async () => {
  // Setup test database
  return new DrizzleAdapter(testDb);
});
```

## Best Practices

1. **Use Transactions**: Ensure your adapter supports transactions for data consistency
2. **Handle Errors**: Implement proper error handling and return meaningful error messages
3. **Connection Pooling**: Use connection pooling for better performance
4. **Migrations**: Always use migrations instead of auto-sync in production
5. **Type Safety**: Leverage TypeScript for type-safe database operations
6. **Testing**: Write comprehensive tests for your adapter implementation