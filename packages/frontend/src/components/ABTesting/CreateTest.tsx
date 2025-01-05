import React from 'react';

export const CreateTest: React.FC = () => (
  <button
    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
    onClick={() => console.log('Create test clicked')}
  >
    Create New Test
  </button>
);