import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const NavBar: React.FC = () => {
  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/logo.svg" 
                alt="Zoobayd Platform" 
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Zoobayd Platform
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/features" className="text-gray-500 hover:text-gray-900">
              Features
            </Link>
            <Link to="/pricing" className="text-gray-500 hover:text-gray-900">
              Pricing
            </Link>
            <Link to="/docs" className="text-gray-500 hover:text-gray-900">
              Documentation
            </Link>
            <Link to="/login" className="text-gray-500 hover:text-gray-900">
              Login
            </Link>
            <Link to="/signup">
              <Button variant="primary">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};