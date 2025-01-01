import React, { useState, useEffect } from 'react';
import { getTests } from '../../api/tests';
import { TestCard } from './TestCard';
import { Test } from '../../types';

export const TestList: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const data = await getTests();
      setTests(data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading tests...</div>;

  return (
    <div className="space-y-4">
      {tests.map(test => (
        <TestCard key={test.id} test={test} onUpdate={fetchTests} />
      ))}
    </div>
  );
};