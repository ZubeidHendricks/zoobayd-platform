import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';

interface Collaboration {
  id: string;
  projectName: string;
  participants: string[];
  code: string;
  lastModified: Date;
}

interface CodeChange {
  type: 'insert' | 'delete';
  position: number;
  content: string;
}

class CollaborativeCodingService {
  private activeCollaborations: Map<string, Collaboration> = new Map();
  private webSocketServer: WebSocket.Server;

  constructor(httpServer: any) {
    this.webSocketServer = new WebSocket.Server({ server: httpServer });
    this.setupWebSocketHandlers();
  }

  private setupWebSocketHandlers() {
    this.webSocketServer.on('connection', (socket) => {
      const sessionId = uuidv4();

      socket.on('message', (message) => {
        const data = JSON.parse(message.toString());
        
        switch(data.type) {
          case 'join_collaboration':
            this.joinCollaboration(sessionId, data.projectId, socket);
            break;
          case 'code_change':
            this.handleCodeChange(sessionId, data.projectId, data.change);
            break;
        }
      });
    });
  }

  createCollaboration(projectName: string, initialParticipant: string): string {
    const collaborationId = uuidv4();
    
    const collaboration: Collaboration = {
      id: collaborationId,
      projectName,
      participants: [initialParticipant],
      code: '',
      lastModified: new Date()
    };

    this.activeCollaborations.set(collaborationId, collaboration);
    return collaborationId;
  }

  private joinCollaboration(sessionId: string, projectId: string, socket: WebSocket) {
    const collaboration = this.activeCollaborations.get(projectId);
    
    if (collaboration) {
      // Send current code state to new participant
      socket.send(JSON.stringify({
        type: 'collaboration_state',
        code: collaboration.code,
        participants: collaboration.participants
      }));
    }
  }

  private handleCodeChange(sessionId: string, projectId: string, change: CodeChange) {
    const collaboration = this.activeCollaborations.get(projectId);
    
    if (collaboration) {
      // Apply code change
      if (change.type === 'insert') {
        collaboration.code = this.insertCode(collaboration.code, change.position, change.content);
      } else if (change.type === 'delete') {
        collaboration.code = this.deleteCode(collaboration.code, change.position, change.content.length);
      }

      collaboration.lastModified = new Date();

      // Broadcast changes to all participants
      this.broadcastChanges(projectId, change);
    }
  }

  private insertCode(originalCode: string, position: number, content: string): string {
    return originalCode.slice(0, position) + content + originalCode.slice(position);
  }

  private deleteCode(originalCode: string, position: number, length: number): string {
    return originalCode.slice(0, position) + originalCode.slice(position + length);
  }

  private broadcastChanges(projectId: string, change: CodeChange) {
    this.webSocketServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'code_update',
          projectId,
          change
        }));
      }
    });
  }

  getActiveCollaborations(): Collaboration[] {
    return Array.from(this.activeCollaborations.values());
  }
}