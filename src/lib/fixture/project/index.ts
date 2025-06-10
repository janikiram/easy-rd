import type { ProjectSimple, ProjectDetail } from '$lib/types';
import { FixtureFactory } from '$lib/utils';
import * as Code from '../code';
import { owner, canEditMember, canInviteMember, me } from '../member';

const fixture = new FixtureFactory<ProjectSimple>(
	(faker) => ({
		id: faker.string.uuid(),
		name: faker.commerce.productName(),
		resource: {
			name: faker.commerce.productName()
		},
		meta: {},
		createdAt: faker.date.past(),
		updatedAt: faker.date.past(),
		url: faker.lorem.sentence(),
		isOwner: faker.datatype.boolean(0.9)
	}),
	{ seed: 100 }
);

export const basic: ProjectDetail = {
	...fixture.create(),
	permission: {
		canView: true,
		canEdit: true,
		canInvite: true
	},
	name: '',
	resource: {
		code: Code.basic
	},
	publicPermission: 'view',
	sharedMembers: [
		{ ...owner, permission: 'invite', isOwner: true },
		{ ...me, permission: 'invite', isMe: true },
		{ ...canEditMember, permission: 'edit' },
		{ ...canInviteMember, permission: 'invite' }
	]
};

export const readOnly: ProjectDetail = {
	...basic,
	permission: {
		canView: true,
		canEdit: false,
		canInvite: false
	}
};

export const editOnly: ProjectDetail = {
	...basic,
	permission: {
		canView: true,
		canEdit: true,
		canInvite: false
	}
};

export const advanced: ProjectDetail = {
	...fixture.create(),
	permission: {},
	name: '',
	resource: {
		code: Code.advanced
	},
	publicPermission: 'view',
	sharedMembers: []
};

const projects: ProjectSimple[] = [basic, ...fixture.createList(100)];

export default projects;
