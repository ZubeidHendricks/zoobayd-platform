import React from 'react';
import { 
  Zap, 
  Shield, 
  Globe, 
  Code, 
  Activity, 
  Wrench 
} from 'lucide-react';

const features = [
  {
    name: 'AI Contract Generation',
    description: 'Generate secure smart contracts in minutes using our advanced AI models trained on audited contracts.',
    icon: Code
  },
  {
    name: 'Automated Security Analysis',
    description: 'Detect vulnerabilities and get actionable security recommendations before deployment.',
    icon: Shield
  },
  {
    name: 'Multi-chain Support',
    description: 'Deploy on multiple blockchains with automatic optimization for each network.',
    icon: Globe
  },
  {
    name: 'Real-time Monitoring',
    description: 'Monitor contract performance and interactions with advanced analytics.',
    icon: Activity
  },
  {
    name: 'Gas Optimization',
    description: 'Optimize your contracts for lower gas costs without compromising security.',
    icon: Zap
  },
  {
    name: 'Development Tools',
    description: 'Comprehensive suite of tools for testing, debugging, and deployment.',
    icon: Wrench
  }
];

export const FeaturesSection: React.FC = () => {
  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
            Features
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to build better smart contracts
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our platform provides all the tools and features you need to develop, test, and deploy secure smart contracts efficiently.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    {feature.name}
                  </p>
                </div>
                <div className="mt-2 ml-16 text-base text-gray-500">
                  {feature.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};