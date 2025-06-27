'use client';

import { useState } from 'react';
import { FiInfo, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export type StatusType = 'red' | 'yellow' | 'green' | 'neutral';

interface KpiStatusCardProps {
  title: string;
  description?: string;
  status: StatusType;
  currentValue: number | string;
  targetValue: number | string;
  unit?: string;
  change?: number;
  changeLabel?: string;
  tooltipText?: string;
}

export default function KpiStatusCard({
  title,
  description,
  status,
  currentValue,
  targetValue,
  unit = '',
  change,
  changeLabel = 'vs. last period',
  tooltipText
}: KpiStatusCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const getStatusClasses = (status: StatusType): string => {
    switch (status) {
      case 'red':
        return 'bg-danger-50 border-danger-300 text-danger-700';
      case 'yellow':
        return 'bg-warning-50 border-warning-300 text-warning-700';
      case 'green':
        return 'bg-success-50 border-success-300 text-success-700';
      default:
        return 'bg-gray-50 border-gray-300 text-gray-700';
    }
  };

  const getStatusDotClasses = (status: StatusType): string => {
    switch (status) {
      case 'red':
        return 'bg-danger-500';
      case 'yellow':
        return 'bg-warning-500';
      case 'green':
        return 'bg-success-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getChangeIndicator = () => {
    if (change === undefined) return null;
    
    const isPositive = change > 0;
    const isNegative = change < 0;
    const absoluteChange = Math.abs(change);
    
    // For some metrics (like incidents), negative change is good and positive is bad
    const isBadTrend = (status === 'red' && isPositive) || (status === 'green' && isNegative);
    const isGoodTrend = (status === 'red' && isNegative) || (status === 'green' && isPositive);
    
    const textColorClass = isBadTrend ? 'text-danger-600' : isGoodTrend ? 'text-success-600' : 'text-gray-500';
    
    return (
      <div className={`flex items-center mt-1 text-sm ${textColorClass}`}>
        {isPositive && <FiChevronUp className="mr-1" />}
        {isNegative && <FiChevronDown className="mr-1" />}
        <span>
          {isPositive ? '+' : ''}{change}{unit} {changeLabel}
        </span>
      </div>
    );
  };

  return (
    <div className={`relative rounded-lg border p-4 ${getStatusClasses(status)}`}>
      <div className="flex justify-between">
        <div className="flex items-center">
          <div className={`h-3 w-3 rounded-full mr-2 ${getStatusDotClasses(status)}`} />
          <h3 className="font-medium">{title}</h3>
        </div>
        
        {tooltipText && (
          <div className="relative">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={() => setShowTooltip(!showTooltip)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <FiInfo size={16} />
            </button>
            
            {showTooltip && (
              <div className="absolute right-0 z-10 mt-2 w-64 rounded-md bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5">
                <p className="text-sm text-gray-600">{tooltipText}</p>
              </div>
            )}
          </div>
        )}
        
        <button
          type="button"
          className="text-gray-400 hover:text-gray-500 ml-2"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
        </button>
      </div>
      
      <div className="mt-2 flex justify-between items-baseline">
        <div className="flex items-baseline">
          <span className="text-2xl font-semibold">
            {currentValue}
            {unit && <span className="text-sm ml-1">{unit}</span>}
          </span>
          <span className="text-sm text-gray-500 ml-2">
            / {targetValue}{unit}
          </span>
        </div>
        
        {getChangeIndicator()}
      </div>
      
      {expanded && description && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      )}
    </div>
  );
}