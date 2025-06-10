export type ProjectSimple = {
	id: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	url: string;
	isOwner: boolean;
};

export type ProjectDetail = ProjectSimple & {
	resource: Resource;
	permission: Partial<{
		canEdit: boolean;
		canInvite: boolean;
		canView: boolean;
	}>;
	publicPermission: Permission;
	sharedMembers: SharedMember[];
};

export type ProjectCreate = {
	name: string;
	resource: Resource;
};

export type ProjectUpdate = {
	name?: string;
	resource?: Resource;
};

export type Resource = {
	code: string;
};

export type Member = {
	id: string;
	name: string;
	email: string;
	image: string;
};

/**
 * Permission은 오른쪽으로 갈 수록 상위 권한이다.
 * view > edit > invite
 * invite는 맴버의 초대 및 권한 수정, 삭제까지 포함한다.
 */
export type Permission = 'view' | 'edit' | 'invite';
export type UpdatePermission =
	| ({
			type: 'public';
	  } & UpdatePublicPermission)
	| ({
			type: 'member';
	  } & UpdateMemberPermission);

export type UpdatePublicPermission = {
	permission: Permission;
};

export type CreateMemberPermission = {
	email: string;
	permission: Permission;
};

export type UpdateMemberPermission = {
	memberId: string;
	permission: Permission;
};

export type DeletePermission = {
	memberId: string;
};

export type SharedMember = Member & {
	isOwner?: boolean;
	isMe?: boolean;
	permission: Permission;
};
