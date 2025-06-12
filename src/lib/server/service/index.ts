import type {
  Member,
  ProjectCreate,
  ProjectDetail,
  ProjectSimple,
  ProjectUpdate,
  Resource,
  UpdateMemberPermission,
  UpdatePublicPermission,
  UpdatePermission,
  Permission,
  DeletePermission,
  SharedMember,
  CreateMemberPermission,
} from "$lib/types";
import type { ResourceAdapter } from "../adapter";
import { fail } from "@sveltejs/kit";
import type { DefaultSession } from "@auth/core/types";
import { assertUnreachable } from "$lib/utils";
import * as MemberDefaultProfile from "$lib/fixture/member/profile-image";
import {
  createNotificationService,
  type NotificationService,
} from "./notification-service";

type Session = {
  user: {
    id: string;
  } & DefaultSession["user"];
};

export interface IService {
  createMember: () => Promise<Member>;
  findAllProjectsOfMember: () => Promise<ProjectSimple[]>;
  findProject: (id: string) => Promise<ProjectDetail>;
  deleteProject: (id: string) => Promise<void>;
  createProject: (props: ProjectCreate) => Promise<ProjectDetail>;
  updateProject: (id: string, props: ProjectUpdate) => Promise<void>;
}

export class Service implements IService {
  #resource: ResourceAdapter;
  #getSession: () => Promise<Session | null>;
  #origin: string;
  #notificationService: NotificationService;
  constructor({
    resource,
    getSession,
    origin,
  }: {
    resource: ResourceAdapter;
    getSession: () => Promise<Session | null>;
    origin: string;
  }) {
    this.#resource = resource;
    this.#getSession = getSession;
    this.#origin = origin;
    this.#notificationService = createNotificationService();
  }

  async createMember(): Promise<Member> {
    const session = await this.#getSession();
    if (session == null) {
      throw fail(401, {
        message: "Can not create member. reason: Unauthorized",
      });
    }

    const found = await this.#resource.getUser({ id: session.user.id });
    if (found != null) return found;

    const newUser = await this.#resource.registerUser({
      id: session.user.id,
      email: session.user.email ?? "",
      name: session.user.name ?? "",
      image: session.user.image ?? MemberDefaultProfile.image1,
    });

    await this.#notificationService.sendOnCreatedUser(newUser);

    return newUser;
  }

  async findAllProjectsOfMember() {
    const session = await this.#getSession();
    if (session == null) return [];
    const memberId = session.user.id;

    const projects = await this.#resource.listUserProjects(memberId);
    
    return projects.map(({ project: p, permission }) => ({
      id: p.id,
      name: p.name,
      meta: p.meta,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      url: this.#getUrl({ name: p.name, id: p.id }),
      isOwner: permission.isOwner ?? false,
    }));
  }

  async findProject(id: string): Promise<ProjectDetail> {
    const session = await this.#getSession();
    const userId = session?.user.id;

    const projectDetail = await this.#resource.getProjectDetails(id);
    if (!projectDetail) {
      throw fail(404, {
        message: `Can not find project ${id}. reason: Not found`,
      });
    }

    // Check permissions
    if (!projectDetail.permission.canView) {
      if (session == null) {
        throw fail(401, {
          message: `Can not find project ${id}. reason: Unauthorized`,
        });
      }

      if (!projectDetail.isOwner && !projectDetail.permission.canView) {
        throw fail(403, {
          message: `Can not find project ${id}. reason: Forbidden`,
        });
      }
    }

    // Add isMe flag to shared members
    const sharedMembers = projectDetail.sharedMembers.map(member => ({
      ...member,
      isMe: member.id === userId
    })).sort((a, b) => {
      if (a.isOwner) return -1;
      if (b.isOwner) return 1;
      if (a.isMe) return -1;
      if (b.isMe) return 1;
      return 0;
    });

    return {
      ...projectDetail,
      url: this.#getUrl({ name: projectDetail.name, id: projectDetail.id }),
      sharedMembers
    };
  }

  async deleteProject(id: string) {
    const session = await this.#getSession();
    if (session == null) {
      throw fail(401, {
        message: `Can not delete project ${id}. reason: Unauthorized`,
      });
    }
    
    const userId = session.user.id;
    const permission = await this.#resource.getUserPermissions(id, userId);

    if (permission == null) {
      throw fail(404, {
        message: `Can not delete project ${id}. reason: Not found`,
      });
    }

    if (permission !== 'edit' && permission !== 'invite') {
      throw fail(403, {
        message: `Can not delete project ${id}. reason: Forbidden`,
      });
    }

    await this.#resource.archiveProject(id);
  }

  async createProject(body: ProjectCreate): Promise<ProjectDetail> {
    const session = await this.#getSession();
    if (session == null) {
      throw fail(401, {
        message: `Can not create project. reason: Unauthorized`,
      });
    }

    const userId = session.user.id;

    const project = await this.#resource.createProject({
      name: body.name ?? "Untitled",
      publicAccess: { view: true },
      ownerId: userId
    });

    await this.#resource.saveProjectContent(project.id, {
      code: body.resource.code
    });

    return {
      id: project.id,
      name: project.name,
      url: this.#getUrl({ name: project.name, id: project.id }),
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      isOwner: true,
      resource: {
        code: body.resource.code,
      },
      publicPermission: project.meta.canEdit ? ("edit" as const) : ("view" as const),
      permission: {
        canView: true,
        canEdit: true,
        canInvite: true,
      },
      sharedMembers: [],
    };
  }

  async updateProject(
    id: string,
    body: { name?: string; resource?: Resource }
  ) {
    const project = await this.#resource.getProject(id);
    if (!project) {
      throw fail(404, {
        message: `Can not update project ${id}. reason: Not found`,
      });
    }

    const session = await this.#getSession();
    let forbidden = false;
    
    if (session == null) {
      if (!project.meta.canEdit) {
        forbidden = true;
      }
    } else {
      const permission = await this.#resource.getUserPermissions(id, session.user.id);
      if (permission !== 'edit' && permission !== 'invite') {
        forbidden = true;
      }
    }

    if (forbidden) {
      throw fail(403, {
        message: `Can not update project ${id}. reason: Forbidden`,
      });
    }

    const updates: any = {};
    if (body.name != null) {
      updates.name = body.name;
    }

    if (Object.keys(updates).length > 0) {
      await this.#resource.updateProject(id, updates);
    }

    if (body.resource != null) {
      await this.#resource.saveProjectContent(id, {
        code: body.resource.code
      });
    }
  }

  async updatePermission(id: string, body: UpdatePermission): Promise<void> {
    if (body.type === "public") {
      return this.#updatePublicPermission(id, body);
    } else {
      return this.#updateMemberPermission(id, body);
    }
  }

  async #updatePublicPermission(
    projectId: string,
    { permission }: UpdatePublicPermission
  ): Promise<void> {
    const session = await this.#getSession();
    if (session == null) {
      throw fail(401, { message: 'Can not update permission. reason: Unauthorized' });
    }

    const userPermission = await this.#resource.getUserPermissions(projectId, session.user.id);
    if (userPermission !== 'invite') {
      throw fail(403, { message: 'Can not update permission. reason: Forbidden' });
    }

    const publicAccess = this.#resolvePermissionToPublicAccess(permission);
    await this.#resource.updateProject(projectId, { publicAccess });
  }

  async createMemberPermission(
    projectId: string,
    { email, permission }: CreateMemberPermission
  ): Promise<SharedMember> {
    const session = await this.#getSession();
    if (session == null) {
      throw fail(401, { message: 'Can not update permission. reason: Unauthorized' });
    }

    const userPermission = await this.#resource.getUserPermissions(projectId, session.user.id);
    if (userPermission !== 'invite') {
      throw fail(403, { message: 'Can not update permission. reason: Forbidden' });
    }

    const user = await this.#resource.getUser({ email });
    if (!user) {
      throw fail(404, {
        message: `Can not update permission. reason: Not found member ${email}`,
      });
    }

    const role = this.#permissionToRole(permission);
    await this.#resource.addCollaborator(projectId, {
      userId: user.id,
      role
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      permission,
      isOwner: false
    };
  }

  async #updateMemberPermission(
    projectId: string,
    { memberId, permission }: UpdateMemberPermission
  ): Promise<void> {
    const session = await this.#getSession();
    if (session == null) {
      throw fail(401, { message: 'Can not update permission. reason: Unauthorized' });
    }

    const userPermission = await this.#resource.getUserPermissions(projectId, session.user.id);
    if (userPermission !== 'invite') {
      throw fail(403, { message: 'Can not update permission. reason: Forbidden' });
    }

    const user = await this.#resource.getUser({ id: memberId });
    if (!user) {
      throw fail(404, {
        message: `Can not update permission. reason: Not found member ${memberId}`,
      });
    }

    const role = this.#permissionToRole(permission);
    await this.#resource.updateCollaborator(projectId, memberId, { role });
  }

  async deletePermission(projectId: string, { memberId }: DeletePermission) {
    const session = await this.#getSession();
    if (session == null) {
      throw fail(401, { message: 'Can not delete permission. reason: Unauthorized' });
    }

    const userPermission = await this.#resource.getUserPermissions(projectId, session.user.id);
    if (userPermission !== 'invite') {
      throw fail(403, { message: 'Can not delete permission. reason: Forbidden' });
    }

    await this.#resource.removeCollaborator(projectId, memberId);
  }

  #getUrl(project: { name: string; id: string }) {
    if (!project.name) return `/workspace/${project.id}`;

    const name = project.name.replace(/ /g, "-").toLowerCase();
    return `${this.#origin}/workspace/${name}-${project.id}`;
  }

  #resolvePermissionToPublicAccess(permission: Permission) {
    switch (permission) {
      case "view":
        return { view: true, edit: false };
      case "edit":
        return { view: true, edit: true };
      case "invite":
        return { view: true, edit: true };
      default:
        assertUnreachable(permission, "Invalid permission");
    }
  }

  #permissionToRole(permission: Permission): 'editor' | 'viewer' {
    switch (permission) {
      case "view":
        return 'viewer';
      case "edit":
        return 'editor';
      case "invite":
        return 'editor'; // ResourceAdapter doesn't have invite role, use editor
      default:
        assertUnreachable(permission, "Invalid permission");
    }
  }
}
