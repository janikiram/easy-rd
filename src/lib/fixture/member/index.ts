import type { Member } from '$lib/types';
import * as MemberProfile from './profile-image';
import { FixtureFactory } from '$lib/utils';
const fixture = new FixtureFactory<Member>(
	(faker) => ({
		email: faker.internet.email().toLowerCase(),
		name: faker.person.fullName(),
		id: faker.string.uuid(),
		image: faker.datatype.boolean(0.5) ? MemberProfile.image1 : MemberProfile.image2
	}),
	{ seed: 100 }
);

export const owner = fixture.create();
export const me = fixture.create();
export const canEditMember = fixture.create();
export const canInviteMember = fixture.create();
export const createMember = ({ email }: { email: string }) => ({ ...fixture.create(), email });

export const members = [owner, me, canEditMember, canInviteMember];
