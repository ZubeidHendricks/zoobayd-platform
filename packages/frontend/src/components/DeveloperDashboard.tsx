import React, { useState, useEffect } from 'react';
import { 
  ContractType, 
  BlockchainNetworkType 
} from '../types/ContractTypes';

interface Project {
  id: string;
  name: string;
  type: ContractType;
  network: BlockchainNetworkType;
  status: 'draft' | 'in_progress' | 'deployed';
  securityScore?: number;
  lastUpdated: Date;
}

const DeveloperDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeView, setActiveView] = useState<'overview' | 'projects' | 'analytics'>('overview');

  useEffect(() => {
    // Fetch user projects
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects', error);
      }
    };

    fetchProjects();
  }, []);

  const renderOverview = () => (
    <div className="dashboard-overview">
      <div className="quick-stats">
        <div className="stat-card">
          <h3>Total Projects</h3>
          <p>{projects.length}</p>
        </div>
        <div className="stat-card">
          <h3>Deployed Contracts</h3>
          <p>{projects.filter(p => p.status === 'deployed').length}</p>
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="projects-list">
      {projects.map(project => (
        <div key={project.id} className="project-card">
          <div className="project-header">
            <h3>{project.name}</h3>
            <span className={`status ${project.status}`}>
              {project.status}
            </span>
          </div>
          <div className="project-details">
            <p>Type: {project.type}</p>
            <p>Network: {project.network}</p>
            {project.securityScore && (
              <div className="security-score">
                Security Score: {project.securityScore.toFixed(2)}%
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderAnalytics = () => (
    <div className="analytics-view">
      <h2>Platform Analytics</h2>
      {/* Placeholder for more detailed analytics */}
    </div>
  );

  return (
    <div className="developer-dashboard">
      <nav className="dashboard-nav">
        <button 
          className={activeView === 'overview' ? 'active' : ''}
          onClick={() => setActiveView('overview')}
        >
          Overview
        </button>
        <button 
          className={activeView === 'projects' ? 'active' : ''}
          onClick={() => setActiveView('projects')}
        >
          Projects
        </button>
        <button 
          className={activeView === 'analytics' ? 'active' : ''}
          onClick={() => setActiveView('analytics')}
        >
          Analytics
        </button>
      </nav>

      <div className="dashboard-content">
        {activeView === 'overview' && renderOverview()}
        {activeView === 'projects' && renderProjects()}
        {activeView === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
};

export default DeveloperDashboard;