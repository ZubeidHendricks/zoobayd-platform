import React from 'react';
import { NavBar } from '../components/LandingPage/NavBar';
import { FeaturesSection } from '../components/LandingPage/FeaturesSection';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import {
  Zap,
  Shield,
  Code,
  LineChart,
  GanttChart,  // Changed from Workflow
  FileCode     // Changed from CodeSquare
} from 'lucide-react';

const detailedFeatures = [
  {
    title: "AI-Powered Contract Generation",
    description: "Generate secure smart contracts in minutes with our advanced AI models trained on thousands of audited contracts.",
    icon: Code,
    details: [
      "Pre-trained on top-performing contracts",
      "Customizable templates for different use cases",
      "Built-in best practices and patterns",
      "Automatic optimization suggestions"
    ]
  },
  {
    title: "Real-time Security Analysis",
    description: "Continuous security monitoring and vulnerability detection throughout the development lifecycle.",
    icon: Shield,
    details: [
      "Dynamic vulnerability scanning",
      "Smart contract audit reports",
      "Automated security testing",
      "Risk assessment metrics"
    ]
  },
  {
    title: "Advanced Analytics",
    description: "Track and analyze your smart contract performance with detailed metrics and insights.",
    icon: LineChart,
    details: [
      "Gas usage optimization",
      "Transaction volume monitoring",
      "User interaction patterns",
      "Performance benchmarking"
    ]
  },
  {
    title: "Multi-chain Deployment",
    description: "Deploy and manage your contracts across multiple blockchain networks with ease.",
    icon: GanttChart,
    details: [
      "One-click multi-chain deployment",
      "Cross-chain analytics",
      "Network-specific optimizations",
      "Unified management interface"
    ]
  },
  {
    title: "Gas Optimization",
    description: "Automatically optimize your contracts for lower gas costs without compromising functionality.",
    icon: Zap,
    details: [
      "Automated gas cost analysis",
      "Code optimization suggestions",
      "Gas usage predictions",
      "Cost comparison tools"
    ]
  },
  {
    title: "Developer Tools",
    description: "Comprehensive suite of development tools to streamline your workflow.",
    icon: FileCode,
    details: [
      "Interactive code editor",
      "Built-in testing framework",
      "Version control integration",
      "CI/CD pipeline support"
    ]
  }
];

export const Features: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Build Better Smart Contracts
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Everything you need to develop, test, and deploy secure smart contracts efficiently.
            </p>
          </div>
        </div>

        {/* Detailed Features */}
        <div className="bg-gray-50 py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-y-20 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-16">
              {detailedFeatures.map((feature) => (
                <div key={feature.title} className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                        <feature.icon className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-500">{feature.description}</p>
                  <ul className="mt-4 space-y-2">
                    {feature.details.map((detail, index) => (
                      <li key={index} className="flex items-center text-gray-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600">
          <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Ready to get started?</span>
              <span className="block">Start your free trial today.</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-blue-100">
              Join thousands of developers building better smart contracts.
            </p>
            <Link to="/signup">
              <Button variant="default" size="lg" className="mt-8">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};