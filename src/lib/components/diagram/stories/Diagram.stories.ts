import type { Meta, StoryObj } from '@storybook/svelte';
import Component from '../Diagram.svelte';
import { projectModel } from '$lib/fixture';
import * as Example from './examples';

const meta = {
	title: 'Component/Diagram',
	component: Component,
	args: {
		project: projectModel.default
	}
} satisfies Meta<Component>;

export default meta;

export type Story = StoryObj<typeof meta>;

export const Default: Story = {
	...Example.Basic
};

export const Cozy: Story = {
	...Example.Cozy
};

export const SimpleJoin: Story = {
	...Example.SimpleJoin
};

export const WithConstraint: Story = {
	...Example.WithConstraint
};
