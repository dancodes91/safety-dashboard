'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DataTable from '@/components/DataTable';
import KpiStatusCard, { StatusType } from '@/components/KpiStatusCard';
import Chart from '@/components/Chart';
import FileUpload from '@/components/FileUpload';
import { FiFilter, FiCalendar, FiDownload, FiUpload, FiSearch } from 'react-icons/fi';
import { DataService } from '@/lib/dataService';
import { useDataSource } from '@/lib/context/DataSourceContext';
import { SamsaraDriverRecord } from '@/types/SamsaraDriverRecord';

// Simulated KPI data
const kpiData = [
  {
    title: 'Average Safety Score',
    currentValue: 92,
    targetValue: 95,
    status: 'yellow' as StatusType,
    unit: '',
    change: 3,
    description: 'Average Samsara driver safety score across all drivers',
    tooltipText: 'Target is 95 or above. Based on driving habits from Samsara.',
  },
  {
    title: 'Speeding Events',
    currentValue: 32,
    targetValue: 20,
    status: 'red' as StatusType,
    unit: '',
    change: -5,
    description: 'Total number of speeding events in current period',
    tooltipText: 'Target is below 20 events. Improving from previous period.',
  },
  {
    title: 'Harsh Events',
    currentValue: 18,
    targetValue: 15,
    status: 'yellow' as StatusType,
    unit: '',
    change: -7,
    description: 'Total harsh acceleration, braking, and turning events',
    tooltipText: 'Target is 15 or fewer events. Significant improvement from last period.',
  },
  {
    title: 'Distracted Driving',
    currentValue: 5,
    targetValue: 0,
    status: 'red' as StatusType,
    unit: '',
    change: -2,
    description: 'Instances of detected distracted driving',
    tooltipText: 'Target is zero events. Any distracted driving requires attention.',
  },
];

// Simulated driver safety trend data
const safetyScoreTrendData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Average Safety Score',
      data: [86, 88, 87, 90, 91, 92],
      backgroundColor: 'rgba(52, 211, 153, 0.2)',
      borderColor: 'rgb(52, 211, 153)',
      borderWidth: 2,
      tension: 0.3,
      fill: true,
    },
    {
      label: 'Target',
      data: [95, 95, 95, 95, 95, 95],
      backgroundColor: 'rgba(0, 0, 0, 0)',
      borderColor: 'rgba(0, 0, 0, 0.2)',
      borderWidth: 2,
      borderDash: [5, 5],
    },
  ],
};

// Simulated event data for bar chart
const drivingEventsData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Speeding Events',
      data: [42, 38, 35, 30, 36, 32],
      backgroundColor: 'rgba(239, 68, 68, 0.7)',
      borderColor: 'rgb(239, 68, 68)',
    },
    {
      label: 'Harsh Acceleration',
      data: [15, 12, 10, 9, 7, 8],
      backgroundColor: 'rgba(249, 115, 22, 0.7)',
      borderColor: 'rgb(249, 115, 22)',
    },
    {
      label: 'Harsh Braking',
      data: [18, 14, 12, 10, 8, 7],
      backgroundColor: 'rgba(234, 179, 8, 0.7)',
      borderColor: 'rgb(234, 179, 8)',
    },
    {
      label: 'Harsh Turning',
      data: [8, 7, 6, 5, 4, 3],
      backgroundColor: 'rgba(16, 185, 129, 0.7)',
      borderColor: 'rgb(16, 185, 129)',
    },
    {
      label: 'Distracted Driving',
      data: [12, 10, 8, 7, 6, 5],
      backgroundColor: 'rgba(99, 102, 241, 0.7)',
      borderColor: 'rgb(99, 102, 241)',
    },
  ],
};

// Table columns definition
const driverColumns = [
  { header: 'Rank', accessorKey: 'rank', sortable: true },
  { header: 'Driver Name', accessorKey: 'driverName', sortable: true },
  { header: 'Driver Tags', accessorKey: 'driverTags', sortable: true },
  { 
    header: 'Safety Score', 
    accessorKey: 'safetyScore', 
    sortable: true,
    cell: ({ row }: { row: any }) => {
      const score = row.safetyScore;
      let scoreClass = 'text-gray-800';
      
      if (score >= 95) scoreClass = 'text-green-600 font-semibold';
      else if (score >= 85) scoreClass = 'text-yellow-600';
      else scoreClass = 'text-red-600 font-semibold';
      
      return (
        <span className={scoreClass}>{score}</span>
      );
    }
  },
  { header: 'Drive Time', accessorKey: 'driveTime', sortable: true },
  { header: 'Distance (mi)', accessorKey: 'totalDistance', sortable: true },
  { header: 'Total Events', accessorKey: 'totalEvents', sortable: true },
  { header: 'Total Behaviors', accessorKey: 'totalBehaviors', sortable: true },
  { 
    header: 'Max Speed', 
    accessorKey: 'speedingData', 
    sortable: true,
    cell: ({ row }: { row: any }) => {
      return `${row.speedingData?.maxSpeed || 0} mph`;
    }
  },
  { 
    header: 'Week Period', 
    accessorKey: 'weekStartDate', 
    sortable: true,
    cell: ({ row }: { row: any }) => {
      const startDate = new Date(row.weekStartDate);
      const endDate = new Date(row.weekEndDate);
      return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    }
  },
];

export default function DriversPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: 'Demo User', email: 'demo@example.com' });
  const [showImportModal, setShowImportModal] = useState(false);
  const [drivers, setDrivers] = useState<SamsaraDriverRecord[]>([]);
  const [driverStats, setDriverStats] = useState<any>(null);
  const [filters, setFilters] = useState({
    driverName: '',
    division: '',
  });
  
  const { useMockData, toggleDataSource } = useDataSource();

  useEffect(() => {
    loadDrivers();
    loadDriverStats();
  }, [useMockData, filters]);

  const loadDrivers = async () => {
    try {
      setLoading(true);
      const response = await DataService.getSamsaraRecords(filters);
      setDrivers(response.records);
    } catch (error) {
      console.error('Error loading drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDriverStats = async () => {
    try {
      const stats = await DataService.getDriverStats();
      setDriverStats(stats);
    } catch (error) {
      console.error('Error loading driver stats:', error);
    }
  };

  const handleRowClick = (driver: any) => {
    // This would navigate to a driver detail page in a real application
    console.log('Driver selected:', driver);
    // router.push(`/drivers/${driver.id}`);
  };

  const handleImportData = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/import/driver-records', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to import data');
      }

      const result = await response.json();
      
      // Refresh the drivers data after successful import
      await loadDrivers();
      await loadDriverStats();
      
      return {
        message: result.message || 'File processed successfully',
        result: result.result || {
          totalRows: result.totalRows || 0,
          imported: result.imported || 0,
          updated: result.updated || 0,
          errors: result.errors || 0
        }
      };
    } catch (error) {
      console.error('Error importing file:', error);
      throw error;
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <DashboardLayout user={user}>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Loading driver data...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Page header */}
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-semibold text-gray-900">Drivers Dashboard</h1>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {useMockData ? 'Mock Data' : 'Database'}
                </span>
                <button
                  type="button"
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    useMockData ? 'bg-gray-200' : 'bg-primary-600'
                  }`}
                  onClick={toggleDataSource}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      useMockData ? 'translate-x-0' : 'translate-x-5'
                    }`}
                  />
                </button>
              </div>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-4">
              <div className="flex space-x-3">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  onClick={() => window.print()}
                >
                  <FiDownload className="mr-2 -ml-0.5 h-4 w-4" />
                  Export Report
                </button>
                <button
                  type="button"
                  className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  onClick={() => setShowImportModal(true)}
                >
                  <FiUpload className="mr-2 -ml-0.5 h-4 w-4" />
                  Import Data
                </button>
              </div>
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

          {/* Filter Controls */}
          <div className="bg-white shadow rounded-lg p-4 sm:p-6">
            <div className="sm:flex sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <FiFilter className="mr-2 h-5 w-5 text-gray-400" />
                Filters
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="division" className="block text-sm font-medium text-gray-700">
                    Division
                  </label>
                  <select
                    id="division"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    defaultValue=""
                  >
                    <option value="">All Divisions</option>
                    <option value="North">North</option>
                    <option value="East">East</option>
                    <option value="South">South</option>
                    <option value="West">West</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    defaultValue=""
                  >
                    <option value="">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Warning">Warning</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="date-range" className="block text-sm font-medium text-gray-700">
                    Date Range
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FiCalendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="date-range"
                      id="date-range"
                      className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="Last 30 days"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Chart
              title="Safety Score Trend (Last 6 Months)"
              type="line"
              data={safetyScoreTrendData}
              description="Average safety score across all drivers"
            />
            <Chart
              title="Driving Events (Last 6 Months)"
              type="bar"
              data={drivingEventsData}
              description="Breakdown of driving events by category"
            />
          </div>

          {/* Driver Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <DataTable
              data={drivers}
              columns={driverColumns}
              title="Driver Safety Records"
              showSearch={true}
              showDownload={true}
              downloadFileName="driver_safety_records"
              onRowClick={handleRowClick}
              className="rounded-lg shadow"
            />
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Import Driver Data
                    </h3>
                    <div className="mt-4">
                      <FileUpload 
                        onUpload={handleImportData} 
                        accept=".xlsx,.xls,.csv"
                        title="Upload Samsara Driver Data"
                        successMessage="Driver data successfully processed"
                        endpoint="/api/import/driver-records"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowImportModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
