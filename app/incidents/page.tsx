'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DataTable from '@/components/DataTable';
import KpiStatusCard, { StatusType } from '@/components/KpiStatusCard';
import Chart from '@/components/Chart';
import FileUpload from '@/components/FileUpload';
import { FiFilter, FiCalendar, FiDownload, FiUpload } from 'react-icons/fi';

// Simulated KPI data
const kpiData = [
  {
    title: 'Total Incidents',
    currentValue: 28,
    targetValue: 0,
    status: 'red' as StatusType,
    unit: '',
    change: -3,
    description: 'Total number of reported incidents in current period',
    tooltipText: 'Target is zero incidents. Any incident requires attention.',
  },
  {
    title: 'Incident Rate',
    currentValue: 2.4,
    targetValue: 2.0,
    status: 'yellow' as StatusType,
    unit: '%',
    change: -0.3,
    description: 'Number of recordable incidents per 100 full-time employees',
    tooltipText: 'Target is below 2.0%. Current status requires attention.',
  },
  {
    title: 'Near Misses',
    currentValue: 45,
    targetValue: 'N/A',
    status: 'neutral' as StatusType,
    unit: '',
    change: 5,
    description: 'Near miss reports (potential incidents that did not occur)',
    tooltipText: 'No specific target, but tracked for prevention insights.',
  },
  {
    title: 'Avg. Closure Time',
    currentValue: 12.5,
    targetValue: 10,
    status: 'yellow' as StatusType,
    unit: ' days',
    change: -2.3,
    description: 'Average time to close incident investigations',
    tooltipText: 'Target is 10 days or less. Improving from previous period.',
  },
];

// Simulated incident trend data
const incidentTrendData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Recordable Incidents',
      data: [5, 3, 6, 4, 2, 8],
      backgroundColor: 'rgba(239, 68, 68, 0.5)',
      borderColor: 'rgb(239, 68, 68)',
      borderWidth: 1,
    },
    {
      label: 'Near Misses',
      data: [12, 9, 15, 11, 7, 10],
      backgroundColor: 'rgba(249, 115, 22, 0.5)',
      borderColor: 'rgb(249, 115, 22)',
      borderWidth: 1,
    },
  ],
};

// Simulated incident type data for pie chart
const incidentTypeData = {
  labels: ['Vehicle Accident', 'Property Damage', 'Injury', 'Near Miss', 'Other'],
  datasets: [
    {
      label: 'Incident Types',
      data: [8, 5, 12, 45, 3],
      backgroundColor: [
        'rgba(239, 68, 68, 0.7)',
        'rgba(249, 115, 22, 0.7)',
        'rgba(234, 179, 8, 0.7)',
        'rgba(16, 185, 129, 0.7)',
        'rgba(99, 102, 241, 0.7)',
      ],
      borderColor: [
        'rgb(239, 68, 68)',
        'rgb(249, 115, 22)',
        'rgb(234, 179, 8)',
        'rgb(16, 185, 129)',
        'rgb(99, 102, 241)',
      ],
      borderWidth: 1,
    },
  ],
};

// Simulated incident data
const incidents = [
  { 
    id: 'INC-001', 
    reportNumber: 'KPA-2023-001',
    date: '2023-06-15', 
    time: '14:30',
    location: 'Route 66 Mile Marker 42',
    employeeId: 'EMP-1042',
    employeeName: 'John Smith',
    type: 'Vehicle Accident', 
    severity: 'High', 
    description: 'Delivery truck side-swiped a parked vehicle while making a delivery.',
    status: 'Under Investigation',
    assignedTo: 'Sarah Johnson',
    reportedBy: 'Michael Brown',
  },
  { 
    id: 'INC-002', 
    reportNumber: 'KPA-2023-002',
    date: '2023-06-10', 
    time: '09:15',
    location: 'Warehouse A, Loading Dock 3',
    employeeId: 'EMP-3821',
    employeeName: 'Robert Garcia',
    type: 'Near Miss', 
    severity: 'Medium', 
    description: 'Forklift operator nearly collided with pedestrian in marked walkway.',
    status: 'Closed',
    assignedTo: 'James Wilson',
    reportedBy: 'David Lee',
  },
  { 
    id: 'INC-003',
    reportNumber: 'KPA-2023-003', 
    date: '2023-06-05', 
    time: '11:45',
    location: 'Main Office, Parking Lot',
    employeeId: 'EMP-7569',
    employeeName: 'Jennifer Lopez',
    type: 'Property Damage', 
    severity: 'Low', 
    description: 'Company vehicle backed into light pole, causing minor damage to bumper.',
    status: 'Resolved',
    assignedTo: 'Thomas Anderson',
    reportedBy: 'Maria Rodriguez',
  },
  { 
    id: 'INC-004',
    reportNumber: 'KPA-2023-004', 
    date: '2023-06-01', 
    time: '13:20',
    location: 'Maintenance Shop',
    employeeId: 'EMP-4217',
    employeeName: 'William Davis',
    type: 'Injury', 
    severity: 'Medium', 
    description: 'Technician sustained minor laceration while servicing equipment.',
    status: 'Under Investigation',
    assignedTo: 'Sarah Johnson',
    reportedBy: 'Richard Martin',
  },
  { 
    id: 'INC-005',
    reportNumber: 'KPA-2023-005', 
    date: '2023-05-28', 
    time: '07:50',
    location: 'Highway 95, Mile Marker 23',
    employeeId: 'EMP-6392',
    employeeName: 'Daniel White',
    type: 'Vehicle Accident', 
    severity: 'High', 
    description: 'Delivery truck hydroplaned during rain storm and struck guardrail.',
    status: 'Closed',
    assignedTo: 'James Wilson',
    reportedBy: 'Patricia Moore',
  },
  { 
    id: 'INC-006',
    reportNumber: 'KPA-2023-006', 
    date: '2023-05-25', 
    time: '15:10',
    location: 'Warehouse B, Aisle 7',
    employeeId: 'EMP-5183',
    employeeName: 'Susan Thompson',
    type: 'Near Miss', 
    severity: 'Low', 
    description: 'Improperly stacked boxes fell from shelf, narrowly missing employee.',
    status: 'Resolved',
    assignedTo: 'Thomas Anderson',
    reportedBy: 'Karen Phillips',
  },
  { 
    id: 'INC-007',
    reportNumber: 'KPA-2023-007', 
    date: '2023-05-20', 
    time: '10:35',
    location: 'Customer Site, 123 Main St',
    employeeId: 'EMP-8241',
    employeeName: 'Christopher Taylor',
    type: 'Injury', 
    severity: 'Medium', 
    description: 'Delivery personnel strained back while lifting heavy package.',
    status: 'Closed',
    assignedTo: 'Sarah Johnson',
    reportedBy: 'Jason Adams',
  },
  { 
    id: 'INC-008',
    reportNumber: 'KPA-2023-008', 
    date: '2023-05-15', 
    time: '09:30',
    location: 'Maintenance Shop, Bay 3',
    employeeId: 'EMP-3712',
    employeeName: 'Michael Jones',
    type: 'Property Damage', 
    severity: 'Low', 
    description: 'Tool dropped and damaged customer equipment during scheduled maintenance.',
    status: 'Resolved',
    assignedTo: 'James Wilson',
    reportedBy: 'Amanda King',
  },
];

// Table columns definition
const incidentColumns = [
  { header: 'ID', accessorKey: 'id', sortable: true },
  { header: 'Report #', accessorKey: 'reportNumber', sortable: true },
  { header: 'Date', accessorKey: 'date', sortable: true },
  { header: 'Type', accessorKey: 'type', sortable: true },
  { header: 'Location', accessorKey: 'location', sortable: true },
  { header: 'Employee', accessorKey: 'employeeName', sortable: true },
  { header: 'Severity', accessorKey: 'severity', sortable: true, 
    cell: ({ row }) => {
      const severity = row.severity;
      let colorClass = 'bg-gray-100 text-gray-800';
      
      if (severity === 'High') colorClass = 'bg-red-100 text-red-800';
      else if (severity === 'Medium') colorClass = 'bg-yellow-100 text-yellow-800';
      else if (severity === 'Low') colorClass = 'bg-green-100 text-green-800';
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs ${colorClass}`}>
          {severity}
        </span>
      );
    }
  },
  { header: 'Status', accessorKey: 'status', sortable: true,
    cell: ({ row }) => {
      const status = row.status;
      let colorClass = 'bg-gray-100 text-gray-800';
      
      if (status === 'Under Investigation') colorClass = 'bg-blue-100 text-blue-800';
      else if (status === 'Closed') colorClass = 'bg-green-100 text-green-800';
      else if (status === 'Resolved') colorClass = 'bg-green-100 text-green-800';
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs ${colorClass}`}>
          {status}
        </span>
      );
    }
  },
];

export default function IncidentsPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: 'Demo User', email: 'demo@example.com' });
  const [showImportModal, setShowImportModal] = useState(false);
  
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleRowClick = (incident) => {
    // This would navigate to an incident detail page in a real application
    console.log('Incident selected:', incident);
    // router.push(`/incidents/${incident.id}`);
  };

  const handleImportData = async (file) => {
    // In a real application, this would send the file to the API
    console.log('Importing file:', file);
    
    // Simulate API response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          message: 'File processed successfully',
          result: {
            totalRows: 15,
            imported: 12,
            updated: 3,
            errors: 0
          }
        });
      }, 2000);
    });
  };

  return (
    <DashboardLayout user={user}>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Loading incidents data...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Page header */}
          <div className="sm:flex sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Incidents Dashboard</h1>
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
                  <label htmlFor="incident-type" className="block text-sm font-medium text-gray-700">
                    Incident Type
                  </label>
                  <select
                    id="incident-type"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    defaultValue=""
                  >
                    <option value="">All Types</option>
                    <option value="Vehicle Accident">Vehicle Accident</option>
                    <option value="Property Damage">Property Damage</option>
                    <option value="Injury">Injury</option>
                    <option value="Near Miss">Near Miss</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="severity" className="block text-sm font-medium text-gray-700">
                    Severity
                  </label>
                  <select
                    id="severity"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    defaultValue=""
                  >
                    <option value="">All Severities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
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
              title="Incident Trends (Last 6 Months)"
              type="bar"
              data={incidentTrendData}
              description="Monthly breakdown of incidents and near misses"
              downloadFileName="incident_trends"
            />
            <Chart
              title="Incident Types"
              type="pie"
              data={incidentTypeData}
              description="Distribution of incidents by type"
              downloadFileName="incident_types"
            />
          </div>

          {/* Incidents Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <DataTable
              data={incidents}
              columns={incidentColumns}
              title="Incident Reports"
              showSearch={true}
              showDownload={true}
              downloadFileName="incident_reports"
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
                      Import Incident Data
                    </h3>
                    <div className="mt-4">
                      <FileUpload 
                        onUpload={handleImportData} 
                        accept=".xlsx,.xls,.csv"
                        title="Upload Incident Data"
                        successMessage="Incident data successfully processed"
                        endpoint="/api/import/kpa-events"
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