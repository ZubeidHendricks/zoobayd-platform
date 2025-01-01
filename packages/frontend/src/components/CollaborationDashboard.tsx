import React, { useState, useEffect } from 'react';
import { ProjectVisibility, UserRole } from '../types/CollaborationTypes';

interface Project {
  id: string;
  name: string;
  description: string;
  visibility: ProjectVisibility;
  members: {
    userId: string;
    email: string;
    role: UserRole;
  }[];
}

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  blockchain: string;
  tags: string[];
}

const CollaborationDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [publicTemplates, setPublicTemplates] = useState<ProjectTemplate[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProjectModal, setNewProjectModal] = useState(false);
  const [inviteMemberModal, setInviteMemberModal] = useState(false);

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    visibility: ProjectVisibility.PRIVATE
  });

  const [inviteMember, setInviteMember] = useState({
    email: '',
    role: UserRole.CONTRIBUTOR
  });

  useEffect(() => {
    // Fetch user's projects
    const fetchProjects = async () => {
      // TODO: Implement actual API call
      // const response = await fetch('/api/projects');
      // const data = await response.json();
      // setProjects(data);
    };

    // Fetch public templates
    const fetchPublicTemplates = async () => {
      // TODO: Implement actual API call
      // const response = await fetch('/api/templates/public');
      // const data = await response.json();
      // setPublicTemplates(data);
    };

    fetchProjects();
    fetchPublicTemplates();
  }, []);

  const createProject = async () => {
    try {
      // TODO: Implement project creation API call
      const newProjectResponse = {
        id: Date.now().toString(),
        ...newProject,
        members: []
      };
      
      setProjects([...projects, newProjectResponse]);
      setNewProjectModal(false);
    } catch (error) {
      console.error('Project creation failed', error);
    }
  };

  const inviteTeamMember = async () => {
    if (!selectedProject) return;

    try {
      // TODO: Implement member invitation API call
      const updatedProject = {
        ...selectedProject,
        members: [
          ...selectedProject.members,
          {
            userId: Date.now().toString(),
            email: inviteMember.email,
            role: inviteMember.role
          }
        ]
      };

      setProjects(projects.map(p => 
        p.id === selectedProject.id ? updatedProject : p
      ));
      setInviteMemberModal(false);
    } catch (error) {
      console.error('Member invitation failed', error);
    }
  };

  return (
    <div className="collaboration-dashboard">
      <div className="projects-section">
        <div className="section-header">
          <h2>My Projects</h2>
          <button 
            onClick={() => setNewProjectModal(true)}
            className="btn-primary"
          >
            Create New Project
          </button>
        </div>

        <div className="project-list">
          {projects.map(project => (
            <div 
              key={project.id} 
              className="project-card"
              onClick={() => setSelectedProject(project)}
            >
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <div className="project-meta">
                <span className="visibility-badge">
                  {project.visibility}
                </span>
                <span className="members-count">
                  {project.members.length} Members
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="public-templates-section">
        <h2>Public Templates</h2>
        <div className="template-grid">
          {publicTemplates.map(template => (
            <div key={template.id} className="template-card">
              <h3>{template.name}</h3>
              <p>{template.description}</p>
              <div className="template-tags">
                {template.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              <span className="blockchain-badge">{template.blockchain}</span>
            </div>
          ))}
        </div>
      </div>

      {/* New Project Modal */}
      {newProjectModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New Project</h2>
            <input 
              placeholder="Project Name"
              value={newProject.name}
              onChange={(e) => setNewProject({
                ...newProject, 
                name: e.target.value
              })}
            />
            <textarea 
              placeholder="Project Description"
              value={newProject.description}
              onChange={(e) => setNewProject({
                ...newProject, 
                description: e.target.value
              })}
            />
            <select
              value={newProject.visibility}
              onChange={(e) => setNewProject({
                ...newProject, 
                visibility: e.target.value as ProjectVisibility
              })}
            >
              {Object.values(ProjectVisibility).map(visibility => (
                <option key={visibility} value={visibility}>
                  {visibility}
                </option>
              ))}
            </select>
            <div className="modal-actions">
              <button onClick={createProject}>Create</button>
              <button onClick={() => setNewProjectModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {inviteMemberModal && selectedProject && (
        <div className="modal">
          <div className="modal-content">
            <h2>Invite Member to {selectedProject.name}</h2>
            <input 
              placeholder="Member Email"
              value={inviteMember.email}
              onChange={(e) => setInviteMember({
                ...inviteMember, 
                email: e.target.value
              })}
            />
            <select
              value={inviteMember.role}
              onChange={(e) => setInviteMember({
                ...inviteMember, 
                role: e.target.value as UserRole
              })}
            >
              {Object.values(UserRole).map(role => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <div className="modal-actions">
              <button onClick={inviteTeamMember}>Invite</button>
              <button onClick={() => setInviteMemberModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborationDashboard;