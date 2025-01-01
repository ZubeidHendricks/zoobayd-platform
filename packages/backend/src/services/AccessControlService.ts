import { UserRole } from './AdvancedAuthenticationService';

interface Permission {
  resource: string;
  actions: string[];
}

class AccessControlService {
  private rolePermissions: Map<UserRole, Permission[]> = new Map();

  constructor() {
    this.initializeRolePermissions();
  }

  private initializeRolePermissions() {
    // Developer Role Permissions
    this.rolePermissions.set(UserRole.DEVELOPER, [
      { 
        resource: 'project', 
        actions: ['create', 'read', 'update', 'delete_own'] 
      },
      { 
        resource: 'contract', 
        actions: ['generate', 'scan', 'deploy_test'] 
      }
    ]);

    // Admin Role Permissions
    this.rolePermissions.set(UserRole.ADMIN, [
      { 
        resource: 'project', 
        actions: ['create', 'read', 'update', 'delete', 'manage_all'] 
      },
      { 
        resource: 'contract', 
        actions: ['generate', 'scan', 'deploy', 'audit'] 
      },
      { 
        resource: 'user', 
        actions: ['manage', 'suspend', 'promote'] 
      }
    ]);

    // Enterprise Role Permissions
    this.rolePermissions.set(UserRole.ENTERPRISE, [
      { 
        resource: 'project', 
        actions: ['create', 'read', 'update', 'delete', 'manage_team'] 
      },
      { 
        resource: 'contract', 
        actions: ['generate', 'scan', 'deploy', 'advanced_audit'] 
      },
      { 
        resource: 'team', 
        actions: ['invite', 'manage_roles', 'view_analytics'] 
      }
    ]);
  }

  // Check if a user has a specific permission
  checkPermission(userRole: UserRole, resource: string, action: string): boolean {
    const permissions = this.rolePermissions.get(userRole);
    if (!permissions) return false;

    return permissions.some(permission => 
      permission.resource === resource && 
      permission.actions.includes(action)
    );
  }

  // Get all permissions for a role
  getRolePermissions(userRole: UserRole): Permission[] {
    return this.rolePermissions.get(userRole) || [];
  }

  // Dynamically add or modify role permissions
  addOrUpdateRolePermission(
    role: UserRole, 
    resource: string, 
    actions: string[]
  ) {
    const existingPermissions = this.rolePermissions.get(role) || [];
    
    const existingResourceIndex = existingPermissions.findIndex(
      p => p.resource === resource
    );

    if (existingResourceIndex !== -1) {
      // Update existing resource permissions
      existingPermissions[existingResourceIndex].actions = [
        ...new Set([
          ...existingPermissions[existingResourceIndex].actions, 
          ...actions
        ])
      ];
    } else {
      // Add new resource permission
      existingPermissions.push({ resource, actions });
    }

    this.rolePermissions.set(role, existingPermissions);
  }
}

export default new AccessControlService();