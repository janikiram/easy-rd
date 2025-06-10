import type { Meta, StoryObj } from '@storybook/svelte';
import Component from '../../lib/ui/workspace/Dashboard.svelte';
import projects from '../../lib/fixture/project';
import WidthUser from '../withuser-decorator';
import { setContext } from 'svelte';

const meta = {
	title: 'Page/workspace/dashboard',
	component: Component,
	parameters: { layout: 'fullscreen' },
	decorators: [
		WidthUser,
		(story) => {
			setContext('popup', { close: () => {} });
			return story();
		}
	],
	args: {
		projects
	}
} as Meta;

export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};
