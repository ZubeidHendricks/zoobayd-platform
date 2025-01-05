import React from 'react';

interface Test {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'draft';
  startDate: string;
  endDate?: string;
}

export const TestList: React.FC = () => {
  const tests: Test[] = [
    {
      id: '1',
      name: 'Homepage Layout Test',
      status: 'active',
      startDate: '2024-01-01'
    }
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Current Tests</h3>
      <div className="space-y-4">
        {tests.map(test => (
          <div
            key={test.id}
            className="border rounded p-4 hover:bg-gray-50 transition-colors"
          >
            <h4 className="font-medium">{test.name}</h4>
            <div className="mt-2 text-sm text-gray-600">
              <span className={`inline-block px-2 py-1 rounded ${test.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
              </span>
              <span className="ml-4">Started: {test.startDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};