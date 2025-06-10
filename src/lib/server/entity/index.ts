import type { ProjectModel as ProjectModel } from '$lib/dbml';
import { sql, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

type MemberMeta = {
	name: string;
	image: string;
};
export const member = sqliteTable('member', {
	id: text('id').primaryKey(),
	email: text('email').notNull(),
	meta: text('meta', { mode: 'json' }).$type<MemberMeta>().notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(strftime('%s', 'now'))`),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(strftime('%s', 'now'))`)
});

export type Member = InferSelectModel<typeof member>;
export type CreateMember = InferInsertModel<typeof member>;

type PublicPermission = {
	canView?: boolean;
	canEdit?: boolean;
};
type ProjectMeta = PublicPermission;
export const project = sqliteTable('project', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	meta: text('meta', { mode: 'json' }).$type<ProjectMeta>().notNull(),
	isDeleted: integer('is_deleted', { mode: 'boolean' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(strftime('%s', 'now'))`),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(strftime('%s', 'now'))`)
});

export type CreateProject = InferInsertModel<typeof project>;
export type Project = InferSelectModel<typeof project>;
type Permission = {
	isOwner?: boolean;
	canEdit?: boolean;
	canInvite?: boolean;
	canView?: boolean;
};

export const projectMember = sqliteTable('project_member', {
	id: text('id').primaryKey(),
	memberId: text('member_id').references(() => member.id),
	projectId: text('project_id').references(() => project.id),
	permission: text('permission', { mode: 'json' }).$type<Permission>().notNull()
});

export type ProjectMember = InferSelectModel<typeof projectMember>;
export type CreateProjectMember = InferInsertModel<typeof projectMember>;

export const resource = sqliteTable('resource', {
	id: text('id').primaryKey(),
	projectId: text('project_id').references(() => project.id),
	code: text('code').notNull(),
	model: text('model', { mode: 'json' }).$type<ProjectModel>().notNull()
});

export type Resource = InferSelectModel<typeof resource>;
export type CreateResource = InferInsertModel<typeof resource>;
