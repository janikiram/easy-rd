import type { Story } from '../Diagram.stories';
import { projectModel } from '$lib/fixture';

const story: Story = {
	args: {
		project: projectModel.withConstraint
	}
};

export default story;
