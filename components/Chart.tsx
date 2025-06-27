'use client';

import { useEffect, useRef } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { FiDownload } from 'react-icons/fi';

// Register all ChartJS components
ChartJS.register(...registerables);

export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea';

export interface ChartProps {
  type: ChartType;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
      fill?: boolean;
      tension?: number;
      // Allow additional dataset props
      [key: string]: any;
    }[];
  };
  options?: any;
  height?: number;
  width?: number;
  title?: string;
  description?: string;
  allowDownload?: boolean;
}

export default function Chart({
  type,
  data,
  options = {},
  height = 300,
  width = 100,
  title,
  description,
  allowDownload = true,
}: ChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Set default options
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
      scales: type !== 'pie' && type !== 'doughnut' && type !== 'polarArea' ? {
        y: {
          beginAtZero: true,
        }
      } : undefined,
    };

    // Create new chart instance
    const ctx = chartRef.current.getContext('2d');
    if (ctx) {
      chartInstance.current = new ChartJS(ctx, {
        type,
        data,
        options: {
          ...defaultOptions,
          ...options,
        },
      });
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [type, data, options]);

  const handleDownload = () => {
    if (!chartRef.current) return;

    const canvas = chartRef.current;
    const image = canvas.toDataURL('image/png', 1.0);
    
    // Create a temporary link element
    const downloadLink = document.createElement('a');
    downloadLink.href = image;
    downloadLink.download = `${title || 'chart'}.png`;
    
    // Trigger download
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {(title || allowDownload) && (
        <div className="flex justify-between items-center mb-3">
          {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          {allowDownload && (
            <button
              type="button"
              onClick={handleDownload}
              className="text-primary-600 hover:text-primary-700 flex items-center text-sm"
            >
              <FiDownload className="mr-1" /> Export
            </button>
          )}
        </div>
      )}
      
      {description && (
        <p className="text-sm text-gray-500 mb-4">{description}</p>
      )}
      
      <div style={{ height: `${height}px`, width: `${width}%` }}>
        <canvas ref={chartRef} />
      </div>
    </div>
  );
}