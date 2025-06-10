import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/server/entity/index.ts',
	out: './migrations'
} satisfies Config;
