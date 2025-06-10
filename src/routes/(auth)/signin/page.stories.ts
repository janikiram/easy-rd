import type { Meta, StoryObj } from '@storybook/svelte';
import Page from './+page.svelte';

const meta = {
	title: 'Page/auth/signin',
	component: Page,
	loaders: [
		async () => ({
			layout: (await import('./+layout.svelte')).default
		})
	],
	decorators: [
		(story, { loaded }) => {
			return { Component: loaded.layout, props: { data: { name: 'asd' }, ...story } };
		}
	],
	parameters: { layout: 'fullscreen' },
	tags: ['autodocs']
} satisfies Meta<Page>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NoSession: Story = { args: { data: { session: null } } };
export const WithSession: Story = {
	args: { data: { session: { user: {}, expires: Date.now() } as any } }
};
