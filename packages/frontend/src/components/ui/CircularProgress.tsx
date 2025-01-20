import * as React from "react"

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  status?: 'normal' | 'warning' | 'critical';
  className?: string;
}

export function CircularProgress({ 
  value, 
  size = 40, 
  strokeWidth = 4,
  status = 'normal',
  className = '' 
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  const statusColors = {
    normal: 'text-blue-600',
    warning: 'text-yellow-500',
    critical: 'text-red-500'
  };

  return (
    <div className={`relative inline-flex ${className}`} style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90">
        <circle
          className="text-gray-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`${statusColors[status]} transition-all duration-300 ease-in-out`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
        {Math.round(value)}%
      </div>
    </div>
  );
}