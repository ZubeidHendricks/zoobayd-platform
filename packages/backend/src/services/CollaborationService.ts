import { v4 as uuidv4 } from 'uuid';
import WebSocket from 'ws';

enum ProjectVisibility {
  PRIVATE = 'private',
  INTERNAL = 'internal',
  PUBLIC = 'public'
}

enum UserRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  CONTRIBUTOR = 'contributor',
  VIEWER = 'viewer'
}

interface ProjectMember {
  userId: string;
  email: string;
  role: UserRole;
  joinedAt: Date;
}

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  blockchain: string;
  sourceCode?: string;
  tags: string[];
}

interface CollaborativeProject {
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

class CollaborationService {
  private projects: Map<string, CollaborativeProject> = new Map();
  private wsServer: WebSocket.Server;

  constructor(httpServer: any) {
    this.wsServer = new WebSocket.Server({ server: httpServer });
    this.setupWebSocketHandlers();
  }

  // Create a new collaborative project
  createProject(
    name: string, 
    description: string, 
    ownerId: string,
    visibility: ProjectVisibility = ProjectVisibility.PRIVATE
  ): CollaborativeProject {
    const project: CollaborativeProject = {
      id: uuidv4(),
      name,
      description,
      visibility,
      owner: ownerId,
      members: [{
        userId: ownerId,
        email: '', // Lookup user email
        role: UserRole.OWNER,
        joinedAt: new Date()
      }],
      templates: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.projects.set(project.id, project);
    return project;
  }

  // Invite members to a project
  inviteMember(
    projectId: string, 
    invitedUserId: string, 
    role: UserRole = UserRole.CONTRIBUTOR
  ) {
    const project = this.projects.get(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    // Check if user is already a member
    const existingMember = project.members.find(m => m.userId === invitedUserId);
    if (existingMember) {
      throw new Error('User is already a member');
    }

    project.members.push({
      userId: invitedUserId,
      email: '', // Lookup user email
      role,
      joinedAt: new Date()
    });

    project.updatedAt = new Date();
    return project;
  }

  // Add a project template
  addProjectTemplate(
    projectId: string, 
    template: Omit<ProjectTemplate, 'id'>
  ): ProjectTemplate {
    const project = this.projects.get(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const newTemplate: ProjectTemplate = {
      id: uuidv4(),
      ...template
    };

    project.templates.push(newTemplate);
    project.updatedAt = new Date();

    return newTemplate;
  }

  // Real-time collaboration WebSocket setup
  private setupWebSocketHandlers() {
    this.wsServer.on('connection', (ws) => {
      ws.on('message', (message) => {
        const data = JSON.parse(message.toString());
        
        switch (data.type) {
          case 'join_project':
            this.handleProjectJoin(data.projectId, ws);
            break;
          case 'code_update':
            this.broadcastCodeUpdate(data.projectId, data.change);
            break;
        }
      });
    });
  }

  private handleProjectJoin(projectId: string, ws: WebSocket) {
    const project = this.projects.get(projectId);
    if (project) {
      // Send current project state
      ws.send(JSON.stringify({
        type: 'project_state',
        project
      }));
    }
  }

  private broadcastCodeUpdate(projectId: string, change: any) {
    this.wsServer.clients.forEach((client) => {
      if (client !== this) {
        client.send(JSON.stringify({
          type: 'code_update',
          projectId,
          change
        }));
      }
    });
  }

  // Marketplace of project templates
  getPublicTemplates(filters?: {
    blockchain?: string;
    tags?: string[];
  }): ProjectTemplate[] {
    // Retrieve public templates with optional filtering
    return Array.from(this.projects.values())
      .filter(project => project.visibility === ProjectVisibility.PUBLIC)
      .flatMap(project => project.templates)
      .filter(template => {
        if (filters?.blockchain && template.blockchain !== filters.blockchain) return false;
        if (filters?.tags && !filters.tags.every(tag => template.tags.includes(tag))) return false;
        return true;
      });
  }
}

export {
  CollaborationService,
  ProjectVisibility,
  UserRole,
  CollaborativeProject,
  ProjectTemplate
};