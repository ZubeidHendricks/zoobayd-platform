export enum ProjectVisibility {
  PRIVATE = 'private',
  INTERNAL = 'internal',
  PUBLIC = 'public'
}

export enum UserRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  CONTRIBUTOR = 'contributor',
  VIEWER = 'viewer'
}

export interface ProjectMember {
  userId: string;
  email: string;
  role: UserRole;
  joinedAt: Date;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  blockchain: string;
  sourceCode?: string;
  tags: string[];
}

export interface CollaborativeProject {
  id: string;
  name: string;
  description: string;
  visibility: ProjectVisibility;
  owner: string;
  members: ProjectMember[];
  templates: ProjectTemplate[];
  createdAt: Date;
  updatedAt: Date;
}