import type { Meta, StoryObj } from '@storybook/svelte';
import Page from '../../routes/workspace/demo/+page.svelte';

const meta = {
	title: 'Page/workspace/demo',
	component: Page,
	parameters: { layout: 'fullscreen' }
} as Meta;

export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};
