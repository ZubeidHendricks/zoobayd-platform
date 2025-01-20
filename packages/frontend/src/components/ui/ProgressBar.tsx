import * as React from "react"

interface ProgressBarProps {
  value: number;
  color?: 'blue' | 'red' | 'green' | 'yellow';
  className?: string;
}

export function ProgressBar({
  value,
  color = 'blue',
  className = ""
}: ProgressBarProps) {
  const colors = {
    blue: 'bg-blue-600',
    red: 'bg-red-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-600'
  };

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
      <div
        className={`${colors[color]} h-2.5 rounded-full transition-all duration-300`}
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}