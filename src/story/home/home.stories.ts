import type { Meta, StoryObj } from '@storybook/svelte';
import Page from '../../routes/(app)/+page.svelte';

const meta = {
	title: 'Page/home',
	component: Page,
	loaders: [
		async () => ({
			layout: (await import('../../routes/(app)/+layout.svelte')).default
		})
	],
	decorators: [
		(story, { loaded }) => {
			return { Component: loaded.layout, ...story };
		}
	],
	parameters: { layout: 'fullscreen' },
	tags: ['autodocs']
} as Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Desktop: Story = { parameters: { viewport: { defaultViewport: 'desktop' } } };
export const Mobile: Story = { parameters: { viewport: { defaultViewport: 'mobile' } } };
