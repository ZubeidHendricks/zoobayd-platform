import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const RootLayout = () => {
  return (
    <div>
      <header className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded"></div>
              <Link to="/" className="flex items-center">
                <span className="text-xl font-semibold">Zoobayd Platform</span>
              </Link>
            </div>

            <div className="flex items-center space-x-8">
              <nav className="flex items-center space-x-8">
                <Link to="/features" className="text-gray-600 hover:text-gray-900">
                  Features
                </Link>
                <Link to="/pricing" className="text-gray-600 hover:text-gray-900">
                  Pricing
                </Link>
                <Link to="/docs" className="text-gray-600 hover:text-gray-900">
                  Documentation
                </Link>
              </nav>
              
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;