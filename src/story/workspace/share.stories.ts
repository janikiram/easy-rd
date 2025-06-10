import type { Meta, StoryObj } from '@storybook/svelte';
import Component from '../../lib/ui/workspace/share/Share.svelte';
import projects, { basic } from '../../lib/fixture/project';
import WidthUser from '../withuser-decorator';
import { projectManager } from '../../lib/store';
import { setContext } from 'svelte';

const meta = {
	title: 'Page/workspace/share',
	component: Component,
	parameters: { layout: 'fullscreen' },
	decorators: [
		WidthUser,
		(story) => {
			setContext('popup', { close: () => {} });
			projectManager.load({ project: basic });

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
