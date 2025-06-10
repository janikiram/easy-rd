import type { Meta, StoryObj } from '@storybook/svelte';
import Editor from './editor.svelte';
import StorybookEditorContainer from './storybook-editor-container.svelte';

import { cozy } from '../../../routes/(app)/temp/dummy';

const meta = {
	title: 'Component/Editor',
	component: Editor,
	decorators: [() => StorybookEditorContainer],
	parameters: { layout: 'fullscreen' },
	tags: ['autodocs']
} satisfies Meta<Editor>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { code: cozy } };
export const Empty: Story = { args: { code: '' } };
