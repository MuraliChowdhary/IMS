// import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: string;
  isNegative?: boolean;
}

function MetricCard({
  title,
  value,
  change,
  icon,
  isNegative = false,
}: MetricCardProps) {
  const changeClass = isNegative ? "text-red-500" : "text-green-500";

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-gray-700 font-medium">{title}</h3>
        <span className="text-gray-400">{icon}</span>
      </div>
      <div className="font-bold text-2xl mb-1">{value}</div>
      <div className={`text-sm flex items-center ${changeClass}`}>
        {!isNegative ? (
          <svg
            className="w-4 h-4 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            ></path>
          </svg>
        ) : (
          <svg
            className="w-4 h-4 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            ></path>
          </svg>
        )}
        <span>{change}</span>
      </div>
    </div>
  );
}

export default MetricCard;
