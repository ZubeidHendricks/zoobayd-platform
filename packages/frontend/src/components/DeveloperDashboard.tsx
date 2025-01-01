import React, { useState } from 'react';

interface Project {
  id: string;
  name: string;
  blockchain: string;
  status: 'draft' | 'deployed' | 'in-progress';
}

const DeveloperDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const templates = [
    { name: 'NFT Collection', blockchain: 'Ethereum' },
    { name: 'DeFi Staking', blockchain: 'Polygon' },
    { name: 'Token Contract', blockchain: 'Binance Smart Chain' }
  ];

  const createNewProject = () => {
    // Logic to create a new project
    const newProject: Project = {
      id: Date.now().toString(),
      name: `New ${selectedTemplate} Project`,
      blockchain: templates.find(t => t.name === selectedTemplate)?.blockchain || '',
      status: 'draft'
    };

    setProjects([...projects, newProject]);
  };

  return (
    <div className="developer-dashboard">
      <h1>Zoobayd Developer Platform</h1>
      
      <section className="project-creation">
        <h2>Start a New Project</h2>
        <select 
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
        >
          <option value="">Select Project Template</option>
          {templates.map(template => (
            <option key={template.name} value={template.name}>
              {template.name} ({template.blockchain})
            </option>
          ))}
        </select>
        <button 
          onClick={createNewProject}
          disabled={!selectedTemplate}
        >
          Create Project
        </button>
      </section>

      <section className="project-list">
        <h2>Your Projects</h2>
        {projects.map(project => (
          <div key={project.id} className="project-card">
            <h3>{project.name}</h3>
            <p>Blockchain: {project.blockchain}</p>
            <p>Status: {project.status}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default DeveloperDashboard;