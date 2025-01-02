import { v4 as uuidv4 } from 'uuid';

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  contractType: string;
  blockchain: string;
  sourceCode: string;
  author: string;
  createdAt: Date;
  popularity: number;
}

interface CollaborationInvite {
  id: string;
  projectId: string;
  invitedEmail: string;
  inviterUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

class CommunityCollaborationService {
  private projectTemplates: Map<string, ProjectTemplate> = new Map();
  private collaborationInvites: Map<string, CollaborationInvite> = new Map();

  // Create a new project template
  createProjectTemplate(
    templateData: Omit<ProjectTemplate, 'id' | 'createdAt' | 'popularity'>
  ): ProjectTemplate {
    const template: ProjectTemplate = {
      id: uuidv4(),
      ...templateData,
      createdAt: new Date(),
      popularity: 0
    };

    this.projectTemplates.set(template.id, template);
    return template;
  }

  // Get project templates with filtering and sorting
  getProjectTemplates(filters?: {
    blockchain?: string;
    contractType?: string;
    minPopularity?: number;
  }): ProjectTemplate[] {
    return Array.from(this.projectTemplates.values())
      .filter(template => {
        if (filters?.blockchain && template.blockchain !== filters.blockchain) return false;
        if (filters?.contractType && template.contractType !== filters.contractType) return false;
        if (filters?.minPopularity && template.popularity < filters.minPopularity) return false;
        return true;
      })
      .sort((a, b) => b.popularity - a.popularity);
  }

  // Send collaboration invite
  sendCollaborationInvite(
    projectId: string, 
    inviterUserId: string, 
    invitedEmail: string
  ): CollaborationInvite {
    const invite: CollaborationInvite = {
      id: uuidv4(),
      projectId,
      inviterUserId,
      invitedEmail,
      status: 'pending',
      createdAt: new Date()
    };

    this.collaborationInvites.set(invite.id, invite);
    return invite;
  }

  // Handle collaboration invite response
  respondToCollaborationInvite(
    inviteId: string, 
    response: 'accepted' | 'rejected'
  ): CollaborationInvite {
    const invite = this.collaborationInvites.get(inviteId);
    if (!invite) {
      throw new Error('Invite not found');
    }

    invite.status = response;
    return invite;
  }

  // Increase template popularity
  incrementTemplatePopularity(templateId: string) {
    const template = this.projectTemplates.get(templateId);
    if (template) {
      template.popularity += 1;
    }
  }
}

export default new CommunityCollaborationService();