'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Chart from '@/components/Chart';
import KpiStatusCard, { StatusType } from '@/components/KpiStatusCard';
import { FiAlertCircle, FiDownload } from 'react-icons/fi';

interface KpiData {
  title: string;
  currentValue: number | string;
  targetValue: number | string;
  status: StatusType;
  unit: string;
  change: number;
  description: string;
  tooltipText: string;
}

interface IncidentData {
  id: string;
  date: string;
  employee: string;
  type: string;
  severity: string;
  status: string;
}

interface TrainingData {
  name: string;
  percentage: number;
}

// Mock KPI data
const kpiData: KpiData[] = [
  {
    title: 'Incidents',
    currentValue: 7,
    targetValue: 0,
    status: 'red' as StatusType,
    unit: '',
    change: -3,
    description: 'Total incidents in current period',
    tooltipText: 'Target is zero incidents. Reduced from 10 in previous period.',
  },
  {
    title: 'Drivers',
    currentValue: 32,
    targetValue: 'N/A',
    status: 'neutral' as StatusType,
    unit: '',
    change: 2,
    description: 'Total active drivers',
    tooltipText: 'Two new drivers added this month',
  },
  {
    title: 'Compliance',
    currentValue: 94.5,
    targetValue: 100,
    status: 'yellow' as StatusType,
    unit: '%',
    change: 2.3,
    description: 'Overall regulatory compliance score',
    tooltipText: 'Target is 100%. Improved from 92.2% in previous period.',
  },
  {
    title: 'Training',
    currentValue: 87,
    targetValue: 95,
    status: 'yellow' as StatusType,
    unit: '%',
    change: 5,
    description: 'Completed required training',
    tooltipText: 'Target is 95% completion. Improved from 82% in previous period.',
  },
];

// Mock incident trend data
const incidentTrendData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Total Incidents',
      data: [12, 14, 10, 8, 10, 7],
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      borderColor: 'rgb(239, 68, 68)',
      borderWidth: 2,
      tension: 0.3,
      fill: true,
    },
    {
      label: 'Target',
      data: [0, 0, 0, 0, 0, 0],
      backgroundColor: 'rgba(0, 0, 0, 0)',
      borderColor: 'rgba(0, 0, 0, 0.2)',
      borderWidth: 2,
      borderDash: [5, 5],
    },
  ],
};

// Mock driver safety scores data
const driverSafetyScoresData = {
  labels: ['90-100', '80-89', '70-79', '60-69', 'Below 60'],
  datasets: [
    {
      label: 'Number of Drivers',
      data: [12, 14, 4, 2, 0],
      backgroundColor: [
        'rgba(52, 211, 153, 0.7)',
        'rgba(250, 204, 21, 0.7)',
        'rgba(251, 146, 60, 0.7)',
        'rgba(239, 68, 68, 0.7)',
        'rgba(156, 163, 175, 0.7)',
      ],
      borderColor: [
        'rgb(52, 211, 153)',
        'rgb(250, 204, 21)',
        'rgb(251, 146, 60)',
        'rgb(239, 68, 68)',
        'rgb(156, 163, 175)',
      ],
    },
  ],
};

// Mock event types data
const eventTypesData = {
  labels: ['Speeding', 'Harsh Braking', 'Harsh Acceleration', 'Harsh Turning', 'Distracted Driving'],
  datasets: [
    {
      label: 'Event Types',
      data: [45, 25, 15, 10, 5],
      backgroundColor: [
        'rgba(239, 68, 68, 0.7)',
        'rgba(251, 146, 60, 0.7)',
        'rgba(250, 204, 21, 0.7)',
        'rgba(52, 211, 153, 0.7)',
        'rgba(99, 102, 241, 0.7)',
      ],
      borderColor: [
        'rgb(239, 68, 68)',
        'rgb(251, 146, 60)',
        'rgb(250, 204, 21)',
        'rgb(52, 211, 153)',
        'rgb(99, 102, 241)',
      ],
    },
  ],
};

// Mock recent incidents data
const recentIncidents = [
  {
    id: 'INC-1042',
    date: '2023-06-12',
    employee: 'Michael Brown',
    type: 'Speeding',
    severity: 'Medium',
    status: 'Under Review',
  },
  {
    id: 'INC-1041',
    date: '2023-06-10',
    employee: 'Sarah Williams',
    type: 'Harsh Braking',
    severity: 'Low',
    status: 'Closed',
  },
  {
    id: 'INC-1040',
    date: '2023-06-08',
    employee: 'John Smith',
    type: 'Distracted Driving',
    severity: 'High',
    status: 'Under Review',
  },
  {
    id: 'INC-1039',
    date: '2023-06-05',
    employee: 'Robert Garcia',
    type: 'Harsh Acceleration',
    severity: 'Medium',
    status: 'Closed',
  },
];

// Mock training compliance data
const trainingData = [
  { name: 'Safety Training', percentage: 92 },
  { name: 'Equipment Training', percentage: 85 },
  { name: 'Compliance Training', percentage: 78 },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: 'Demo User', email: 'demo@example.com' });

  useEffect(() => {
    // This would fetch initial dashboard data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <DashboardLayout user={user}>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Loading dashboard data...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Page header */}
          <div className="sm:flex sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Safety Dashboard</h1>
            <div className="mt-3 sm:mt-0 sm:ml-4">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={() => window.print()}
              >
                <FiDownload className="mr-2 -ml-0.5 h-4 w-4" />
                Export Report
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {kpiData.map((kpi, index) => (
              <KpiStatusCard
                key={index}
                title={kpi.title}
                currentValue={kpi.currentValue}
                targetValue={kpi.targetValue}
                status={kpi.status}
                unit={kpi.unit}
                change={kpi.change}
                description={kpi.description}
                tooltipText={kpi.tooltipText}
              />
            ))}
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Chart
              title="Incident Trend (Last 6 Months)"
              type="line"
              data={incidentTrendData}
              description="Total incidents reported by month"
            />
            <Chart
              title="Driver Safety Scores"
              type="bar"
              data={driverSafetyScoresData}
              description="Distribution of drivers by safety score range"
            />
          </div>
          
          {/* KPI Status and Recent Incidents */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="card">
              <h3 className="text-lg font-medium mb-4">KPI Status</h3>
              <div className="space-y-4">
                {/* Sample KPI indicators with color status */}
                <div className="status-red p-3 rounded">
                  <div className="flex justify-between items-center">
                    <span>Preventable Incidents</span>
                    <span className="font-bold">5 / 0</span>
                  </div>
                </div>
                <div className="status-yellow p-3 rounded">
                  <div className="flex justify-between items-center">
                    <span>Driver Safety Score</span>
                    <span className="font-bold">85 / 90</span>
                  </div>
                </div>
                <div className="status-green p-3 rounded">
                  <div className="flex justify-between items-center">
                    <span>Training Compliance</span>
                    <span className="font-bold">98% / 95%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-medium mb-4">Recent Incidents</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report#</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentIncidents.map((incident) => (
                      <tr key={incident.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">{incident.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{incident.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{incident.employee}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`px-2 py-1 rounded-full text-xs inline-flex items-center ${
                            incident.type === 'Speeding' ? 'bg-red-100 text-red-800' :
                            incident.type === 'Harsh Braking' ? 'bg-orange-100 text-orange-800' :
                            incident.type === 'Harsh Acceleration' ? 'bg-yellow-100 text-yellow-800' :
                            incident.type === 'Harsh Turning' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            <FiAlertCircle className="mr-1 h-3 w-3" />
                            {incident.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Event Types and Training Compliance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Chart
              title="Event Types Distribution"
              type="pie"
              data={eventTypesData}
              description="Breakdown of safety events by category"
            />
            <div className="card h-80">
              <h3 className="text-lg font-medium mb-4">Training Compliance</h3>
              <div className="space-y-4">
                {trainingData.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-sm font-medium">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-success-600 h-2.5 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
