# Resource Adapter Pattern

Easy-RD uses a resource adapter pattern to provide flexibility in choosing your data source. Unlike traditional database-only approaches, this pattern allows you to use databases, REST APIs, GraphQL endpoints, or any other data source.

## Core Concept

The Resource Adapter pattern abstracts data operations around domain concepts rather than storage specifics:

- **User Management**: Handle user registration and retrieval
- **Project Management**: Create, read, update, and archive projects  
- **Content Management**: Save and retrieve project content
- **Collaboration**: Manage project collaborators and permissions

## Migration from Database Adapters

If you're migrating from the old `DatabaseAdapter` interface:

### Key Changes

1. **Interface Name**: `DatabaseAdapter` → `ResourceAdapter`
2. **Method Names**: More domain-focused
   - `findMemberById` → `getUser`
   - `createProjectMember` → `addCollaborator`
   - `findProjectsByMemberId` → `listUserProjects`
3. **No DB-specific fields**: Remove `isDeleted`, `createdAt`, `updatedAt` from interfaces
4. **Domain Models**: Use business models instead of database schemas

### Compatibility

The old `DatabaseAdapter` type is aliased to `ResourceAdapter` for backward compatibility:

```typescript
// This still works
export type DatabaseAdapter = ResourceAdapter;
```

## Built-in Implementations

### Drizzle ORM with Cloudflare D1

The default implementation using Drizzle ORM:

```typescript
import { DrizzleAdapter } from '$lib/server/adapter';
import { drizzle } from 'drizzle-orm/d1';

const db = drizzle(env.DB);
const adapter = new DrizzleAdapter(db);
```

## Custom Adapter Examples

### REST API Adapter

Connect to a backend API instead of a database:

```typescript
import type { ResourceAdapter } from '$lib/server/adapter';
import type { Member, ProjectSimple, ProjectDetail } from '$lib/types';

export class APIAdapter implements ResourceAdapter {
  private apiUrl: string;
  private headers: HeadersInit;

  constructor(config: { apiUrl: string; apiKey?: string }) {
    this.apiUrl = config.apiUrl;
    this.headers = {
      'Content-Type': 'application/json',
      ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` })
    };
  }

  async getUser(identifier: { id: string } | { email: string }): Promise<Member | null> {
    const params = new URLSearchParams();
    if ('id' in identifier) {
      params.set('id', identifier.id);
    } else {
      params.set('email', identifier.email);
    }

    const response = await fetch(`${this.apiUrl}/users?${params}`, {
      headers: this.headers
    });

    if (!response.ok) return null;
    return response.json();
  }

  async createProject(data: {
    name: string;
    publicAccess: { view: boolean; edit?: boolean };
  }): Promise<ProjectSimple> {
    const response = await fetch(`${this.apiUrl}/projects`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Failed to create project: ${response.statusText}`);
    }

    return response.json();
  }

  // ... implement other methods
}
```

### GraphQL Adapter

For GraphQL backends:

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
    
    try {
      const data = await this.client.request(query, identifier);
      return data.user;
    } catch (error) {
      return null;
    }
  }

  async listUserProjects(userId: string): Promise<Array<{
    project: ProjectSimple;
    role: 'owner' | 'collaborator' | 'viewer';
  }>> {
    const query = `
      query ListUserProjects($userId: ID!) {
        userProjects(userId: $userId) {
          project {
            id
            name
            publicPermission
            permission {
              canView
              canEdit
              canInvite
            }
            isOwner
            createdAt
            updatedAt
          }
          role
        }
      }
    `;
    
    const data = await this.client.request(query, { userId });
    return data.userProjects;
  }

  // ... implement other methods
}
```

### Hybrid Adapter

Combine multiple data sources:

```typescript
export class HybridAdapter implements ResourceAdapter {
  constructor(
    private userApi: APIAdapter,
    private projectDb: DrizzleAdapter
  ) {}

  // Use API for user management
  async getUser(identifier: { id: string } | { email: string }): Promise<Member | null> {
    return this.userApi.getUser(identifier);
  }

  // Use database for project management
  async createProject(data: {
    name: string;
    publicAccess: { view: boolean; edit?: boolean };
  }): Promise<ProjectSimple> {
    return this.projectDb.createProject(data);
  }

  // ... implement other methods
}
```

### In-Memory Adapter (for testing)

```typescript
export class InMemoryAdapter implements ResourceAdapter {
  private users = new Map<string, Member>();
  private projects = new Map<string, ProjectDetail>();
  private collaborators = new Map<string, Set<string>>();

  async registerUser(user: {
    id: string;
    email: string;
    name: string;
    image: string;
  }): Promise<Member> {
    const member = { ...user };
    this.users.set(user.id, member);
    return member;
  }

  async getUser(identifier: { id: string } | { email: string }): Promise<Member | null> {
    if ('id' in identifier) {
      return this.users.get(identifier.id) || null;
    }
    
    for (const user of this.users.values()) {
      if (user.email === identifier.email) {
        return user;
      }
    }
    return null;
  }

  async createProject(data: {
    name: string;
    publicAccess: { view: boolean; edit?: boolean };
  }): Promise<ProjectSimple> {
    const project: ProjectSimple = {
      id: crypto.randomUUID(),
      name: data.name,
      publicPermission: data.publicAccess.edit ? 'edit' : 'view',
      permission: {
        canView: true,
        canEdit: true,
        canInvite: true
      },
      isOwner: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.projects.set(project.id, {
      ...project,
      url: `/projects/${project.id}`,
      resource: { code: '' },
      sharedMembers: []
    });
    
    return project;
  }

  // ... implement other methods
}
```

## Configuration

### Using Custom Adapters

Configure your adapter in `hooks.server.ts`:

```typescript
import { createAdapterHandler } from '$lib/server/adapter';
import { APIAdapter } from './my-api-adapter';

// Option 1: Direct configuration
const adapter = new APIAdapter({
  apiUrl: 'https://api.easy-rd.dev',
  apiKey: process.env.API_KEY
});

export const handle = createAdapterHandler(adapter);

// Option 2: Environment-based configuration
export const handle = createAdapterHandler(
  process.env.USE_API === 'true'
    ? new APIAdapter({ apiUrl: process.env.API_URL! })
    : undefined // Falls back to default Drizzle adapter
);
```

### Multiple Adapters

Use different adapters for different environments:

```typescript
import { dev } from '$app/environment';
import { InMemoryAdapter } from './in-memory-adapter';
import { APIAdapter } from './api-adapter';
import { createAdapterHandler } from '$lib/server/adapter';

const adapter = dev
  ? new InMemoryAdapter() // Fast development
  : new APIAdapter({      // Production API
      apiUrl: process.env.API_URL!,
      apiKey: process.env.API_KEY!
    });

export const handle = createAdapterHandler(adapter);
```

## Testing

### Unit Testing Adapters

Create a test suite for any adapter:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import type { ResourceAdapter } from '$lib/server/adapter';

export function testResourceAdapter(
  name: string,
  createAdapter: () => Promise<ResourceAdapter>
) {
  describe(`${name} ResourceAdapter`, () => {
    let adapter: ResourceAdapter;
    
    beforeEach(async () => {
      adapter = await createAdapter();
    });
    
    describe('User Management', () => {
      it('should register and retrieve a user', async () => {
        const userData = {
          id: 'test-123',
          email: 'test@example.com',
          name: 'Test User',
          image: 'https://example.com/avatar.jpg'
        };
        
        const created = await adapter.registerUser(userData);
        expect(created).toEqual(userData);
        
        const byId = await adapter.getUser({ id: userData.id });
        expect(byId).toEqual(userData);
        
        const byEmail = await adapter.getUser({ email: userData.email });
        expect(byEmail).toEqual(userData);
      });
    });
    
    describe('Project Management', () => {
      it('should create and retrieve projects', async () => {
        const projectData = {
          name: 'Test Project',
          publicAccess: { view: true, edit: false }
        };
        
        const project = await adapter.createProject(projectData);
        expect(project.name).toBe(projectData.name);
        expect(project.publicPermission).toBe('view');
        
        const retrieved = await adapter.getProject(project.id);
        expect(retrieved?.id).toBe(project.id);
      });
    });
    
    // ... test other methods
  });
}

// Test different implementations
testResourceAdapter('InMemory', async () => new InMemoryAdapter());
testResourceAdapter('API', async () => new APIAdapter({ apiUrl: 'http://localhost:3000' }));
```

### Integration Testing

Test your application with different adapters:

```typescript
import { expect, test } from '@playwright/test';
import { InMemoryAdapter } from './in-memory-adapter';

test.beforeEach(async ({ page }) => {
  // Inject test adapter
  await page.addInitScript(() => {
    window.__testAdapter = new InMemoryAdapter();
  });
});

test('create and edit project', async ({ page }) => {
  await page.goto('/');
  // Your integration tests
});
```

## Best Practices

1. **Error Handling**: Return `null` for "not found", throw for actual errors
2. **Type Safety**: Leverage TypeScript's type system
3. **Stateless Design**: Don't store state in adapter instances
4. **Consistent Behavior**: Ensure all adapters behave the same way
5. **Documentation**: Document any adapter-specific behavior or limitations
6. **Performance**: Consider caching for read-heavy operations
7. **Security**: Validate inputs and sanitize outputs

## Troubleshooting

### Common Issues

1. **Type Errors**: Ensure your adapter implements all required methods
2. **Async Issues**: All adapter methods must return Promises
3. **Missing Data**: Check that your adapter properly transforms data to match the interface
4. **Performance**: Profile your adapter methods for bottlenecks

### Debug Mode

Add logging to debug adapter calls:

```typescript
export class DebugAdapter implements ResourceAdapter {
  constructor(private adapter: ResourceAdapter) {}
  
  async getUser(identifier: { id: string } | { email: string }): Promise<Member | null> {
    console.log('getUser called with:', identifier);
    const result = await this.adapter.getUser(identifier);
    console.log('getUser returned:', result);
    return result;
  }
  
  // Wrap other methods similarly
}

// Use in development
const adapter = new DebugAdapter(new YourAdapter());
```