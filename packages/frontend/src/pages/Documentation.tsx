import React from 'react';
import { NavBar } from '../components/LandingPage/NavBar';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { 
  BookOpen,
  Code,
  Terminal,
  FileText,
  Settings,
  Coffee
} from 'lucide-react';

const sections = [
  {
    title: 'Getting Started',
    icon: Coffee,
    description: 'Learn the basics of using Zoobayd Platform',
    links: [
      { title: 'Basic Concepts', href: '/docs/concepts' },
      { title: 'Installation', href: '/docs/installation' },
      { title: 'Quick Start Guide', href: '/docs/quick-start' }
    ].sort((a, b) => a.title.localeCompare(b.title))
  },
  {
    title: 'Smart Contracts',
    icon: Code,
    description: 'Learn about creating and managing smart contracts',
    links: [
      { title: 'AI Generation', href: '/docs/ai-generation' },
      { title: 'Contract Templates', href: '/docs/templates' },
      { title: 'Custom Contracts', href: '/docs/custom-contracts' }
    ].sort((a, b) => a.title.localeCompare(b.title))
  },
  {
    title: 'Security',
    icon: Terminal,
    description: 'Understand security features and best practices',
    links: [
      { title: 'Audit Reports', href: '/docs/audit-reports' },
      { title: 'Best Practices', href: '/docs/best-practices' },
      { title: 'Security Analysis', href: '/docs/security' }
    ].sort((a, b) => a.title.localeCompare(b.title))
  },
  {
    title: 'API Reference',
    icon: FileText,
    description: 'Comprehensive API documentation',
    links: [
      { title: 'GraphQL API', href: '/docs/api-graphql' },
      { title: 'REST API', href: '/docs/api-rest' },
      { title: 'WebSocket API', href: '/docs/api-websocket' }
    ].sort((a, b) => a.title.localeCompare(b.title))
  },
  {
    title: 'Configuration',
    icon: Settings,
    description: 'Configure and customize the platform',
    links: [
      { title: 'Advanced Config', href: '/docs/advanced-config' },
      { title: 'Gas Optimization', href: '/docs/gas-optimization' },
      { title: 'Network Settings', href: '/docs/network-settings' }
    ].sort((a, b) => a.title.localeCompare(b.title))
  }
].sort((a, b) => a.title.localeCompare(b.title));

export const Documentation: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="pt-20">
        {/* Documentation Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Documentation
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Everything you need to know about using the Zoobayd Platform.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <Link to="/docs/quick-start">
                <Button variant="primary">Get Started</Button>
              </Link>
              <Link to="/docs/api-rest">
                <Button variant="outline">API Reference</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => (
              <div
                key={section.title}
                className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow-sm rounded-lg overflow-hidden"
              >
                <div className="relative">
                  <div className="flex items-center">
                    <section.icon className="h-8 w-8 text-blue-500" />
                    <h3 className="ml-3 text-xl font-semibold text-gray-900">{section.title}</h3>
                  </div>
                  <p className="mt-4 text-base text-gray-500">{section.description}</p>
                  <ul className="mt-6 space-y-3">
                    {section.links.map((link) => (
                      <li key={link.title}>
                        <Link
                          to={link.href}
                          className="text-base text-blue-600 hover:text-blue-500"
                        >
                          {link.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};