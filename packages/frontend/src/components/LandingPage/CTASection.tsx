import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const CTASection: React.FC = () => {
  return (
    <div className="bg-blue-600">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span className="block">Ready to get started?</span>
          <span className="block text-blue-200">Try Zoobayd Platform today.</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <Link to="/signup">
              <Button
                variant="default"
                size="lg"
                className="text-blue-600 hover:text-blue-700"
              >
                Get started
              </Button>
            </Link>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="text-white border-white hover:bg-blue-700"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};