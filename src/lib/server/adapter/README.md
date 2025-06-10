# Resource Adapter Pattern

The Resource Adapter pattern provides a clean abstraction over data sources, allowing Easy-RD to work with different backends like databases, REST APIs, GraphQL, or any other data source.

## Why Resource Adapter?

Instead of tightly coupling the application to a specific database or ORM, the Resource Adapter pattern:

- **Enables flexibility**: Switch between different data sources without changing business logic
- **Improves testability**: Easily mock data sources for testing
- **Supports multiple backends**: Use databases, APIs, or hybrid approaches
- **Maintains clean architecture**: Separates data access concerns from business logic

## Core Concepts

The adapter interface is organized around domain concepts rather than database operations:

- **User Management**: Register users, retrieve user information
- **Project Management**: Create, read, update, and archive projects
- **Content Management**: Save and retrieve project content
- **Collaboration**: Manage project collaborators and permissions

## Built-in Adapters

### DrizzleAdapter

The default adapter using Drizzle ORM with Cloudflare D1:

```typescript
import { DrizzleAdapter } from '$lib/server/adapter';
import { drizzle } from 'drizzle-orm/d1';

const db = drizzle(env.DB);
const adapter = new DrizzleAdapter(db);
```

## Creating Custom Adapters

To create a custom adapter, implement the `ResourceAdapter` interface:

```typescript
import type { ResourceAdapter } from '$lib/server/adapter';

export class MyCustomAdapter implements ResourceAdapter {
  // Implement all required methods
  async registerUser(user: {...}): Promise<Member> {
    // Your implementation
  }
  
  async getUser(identifier: {...}): Promise<Member | null> {
    // Your implementation
  }
  
  // ... implement other methods
}
```

### Example: REST API Adapter

```typescript
import type { ResourceAdapter } from '$lib/server/adapter';

export class APIAdapter implements ResourceAdapter {
  private apiUrl: string;
  
  constructor(config: { apiUrl: string; apiKey?: string }) {
    this.apiUrl = config.apiUrl;
    // Setup authentication
  }
  
  async getUser(identifier: { id: string } | { email: string }): Promise<Member | null> {
    const response = await fetch(`${this.apiUrl}/users`, {
      // API request configuration
    });
    return response.json();
  }
  
  // ... implement other methods
}
```

### Example: GraphQL Adapter

```typescript
import { GraphQLClient } from 'graphql-request';
import type { ResourceAdapter } from '$lib/server/adapter';

export class GraphQLAdapter implements ResourceAdapter {
  private client: GraphQLClient;
  
  constructor(config: { endpoint: string; token?: string }) {
    this.client = new GraphQLClient(config.endpoint, {
      headers: config.token ? { authorization: `Bearer ${config.token}` } : {}
    });
  }
  
  async getUser(identifier: { id: string } | { email: string }): Promise<Member | null> {
    const query = `
      query GetUser($id: ID, $email: String) {
        user(id: $id, email: $email) {
          id
          email
          name
          image
        }
      }
    `;
    
    const data = await this.client.request(query, identifier);
    return data.user;
  }
  
  // ... implement other methods
}
```

## Using Custom Adapters

Configure your custom adapter in `hooks.server.ts`:

```typescript
import { createAdapterHandler } from '$lib/server/adapter';
import { MyCustomAdapter } from './my-custom-adapter';

const adapter = new MyCustomAdapter({
  // Your configuration
});

export const handle = createAdapterHandler(adapter);
```

## Migration Guide

If you're migrating from the old `DatabaseAdapter`:

1. The interface is now called `ResourceAdapter`
2. Method names are more domain-focused:
   - `findMemberById` → `getUser`
   - `createProjectMember` → `addCollaborator`
   - `findProjectsByMemberId` → `listUserProjects`
3. Return types use domain models instead of database schemas
4. No database-specific fields like `isDeleted` in the interface

## Best Practices

1. **Keep adapters stateless**: Don't store state in adapter instances
2. **Handle errors gracefully**: Return `null` for not found, throw for errors
3. **Use type safety**: Leverage TypeScript for type checking
4. **Test your adapters**: Create unit tests for each adapter method
5. **Document assumptions**: Be clear about expected behavior

## Testing

Create an in-memory adapter for testing:

```typescript
export class InMemoryAdapter implements ResourceAdapter {
  private users = new Map<string, Member>();
  private projects = new Map<string, ProjectDetail>();
  
  async registerUser(user: {...}): Promise<Member> {
    const member = { ...user };
    this.users.set(user.id, member);
    return member;
  }
  
  // Simple in-memory implementations
}
```

Use it in your tests:

```typescript
import { InMemoryAdapter } from './in-memory-adapter';

const adapter = new InMemoryAdapter();
// Run your tests with the in-memory adapter
```