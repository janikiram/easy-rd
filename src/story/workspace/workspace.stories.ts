import type { Meta, StoryObj } from '@storybook/svelte';
import Page from '../../routes/workspace/[title_id]/+page.svelte';
import projects, { basic, editOnly, readOnly } from '../../lib/fixture/project';
import { projectManager } from '../../lib/store';
import WidthUser from '../withuser-decorator';

const meta = {
	title: 'Page/workspace',
	component: Page,
	parameters: { layout: 'fullscreen' },
	args: {
		data: {
			project: basic
		}
	},
	decorators: [
		WidthUser,
		(story) => {
			projectManager.load({ projects });
			return story();
		}
	]
} as Meta;

export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const ReadOnly: Story = {
	args: {
		data: {
			project: readOnly
		}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as any
};

export const EditOnly: Story = {
	args: {
		data: {
			project: editOnly
		}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as any
};
