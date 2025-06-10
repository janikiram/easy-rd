# Authentication Configuration

This project uses [Auth.js](https://authjs.dev/) (formerly NextAuth.js) for authentication. The authentication system is designed to be flexible and support multiple OAuth providers.

## Setup

1. Copy `.env.example` to `.env`
2. Generate a secure `AUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```
3. Configure your OAuth providers in `OAUTH_CREDENTIALS`

## Supported Providers

Currently supported OAuth providers:
- GitHub

### Adding GitHub OAuth

1. Create a GitHub OAuth App:
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Click "New OAuth App"
   - Set Authorization callback URL to: `http://localhost:5173/auth/callback/github`
   - For production, use your domain: `https://yourdomain.com/auth/callback/github`

2. Add credentials to `.env`:
   ```
   OAUTH_CREDENTIALS=github:your_client_id:your_client_secret
   ```

## Adding New Providers

To add support for new OAuth providers:

1. Install the provider from Auth.js:
   ```bash
   npm install @auth/sveltekit
   ```

2. Update `src/lib/utils/credentials.ts`:
   ```typescript
   import Google from '@auth/sveltekit/providers/google';
   
   // In _resolveItems function:
   if (type === 'google') {
     yield Google({ clientId, clientSecret });
   }
   ```

3. Add to `OAUTH_CREDENTIALS`:
   ```
   OAUTH_CREDENTIALS=github:id:secret|google:id:secret
   ```

## Custom Authentication

If you need custom authentication logic, you can:

1. Replace the auth configuration in `src/lib/auth/index.ts`
2. Implement your own authentication middleware
3. Update the session callbacks as needed

## Session Management

The session includes:
- `user.id`: Unique user identifier
- `user.email`: User email
- `user.name`: Display name
- `user.image`: Profile image URL

Sessions are managed by Auth.js and stored securely using JWT tokens.