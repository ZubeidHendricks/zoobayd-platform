import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const HeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Smart Contract Development</span>
                <span className="block text-blue-600">Made Simple</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Build, test, and deploy secure smart contracts with our AI-powered platform. Get started in minutes with enterprise-grade security and multi-chain support.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link to="/signup">
                    <Button variant="primary" size="lg" className="w-full">
                      Start Free Trial
                    </Button>
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link to="/features">
                    <Button variant="outline" size="lg" className="w-full">
                      View Features
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="h-56 w-full bg-blue-600 sm:h-72 lg:h-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600">
            <div className="absolute inset-0 bg-grid-white/[0.2] bg-[length:16px_16px]" />
          </div>
        </div>
      </div>
    </div>
  );
};