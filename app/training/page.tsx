'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DataTable from '@/components/DataTable';
import KpiStatusCard, { StatusType } from '@/components/KpiStatusCard';
import Chart from '@/components/Chart';
import FileUpload from '@/components/FileUpload';
import { FiFilter, FiCalendar, FiDownload, FiUpload, FiCheck, FiX, FiClock, FiAlertCircle } from 'react-icons/fi';

// Simulated KPI data
const kpiData = [
  {
    title: 'Overall Completion',
    currentValue: 86.5,
    targetValue: 100,
    status: 'yellow' as StatusType,
    unit: '%',
    change: 3.2,
    description: 'Overall training completion rate across all employees',
    tooltipText: 'Target is 100%. Current score shows improvement from last quarter.',
  },
  {
    title: 'Certification Rate',
    currentValue: 92,
    targetValue: 95,
    status: 'yellow' as StatusType,
    unit: '%',
    change: 5,
    description: 'Percentage of employees with up-to-date certifications',
    tooltipText: 'Target is 95% or above. Based on required certifications for roles.',
  },
  {
    title: 'Expiring Soon',
    currentValue: 12,
    targetValue: 'N/A',
    status: 'neutral' as StatusType,
    unit: '',
    change: -3,
    description: 'Certifications expiring in next 30 days',
    tooltipText: 'Informational metric to track upcoming certification renewals.',
  },
  {
    title: 'Overdue Training',
    currentValue: 8,
    targetValue: 0,
    status: 'red' as StatusType,
    unit: '',
    change: -4,
    description: 'Number of overdue training modules or certifications',
    tooltipText: 'Target is zero overdue items. Improvement from 12 last month.',
  },
];

// Simulated training completion trend data
const trainingCompletionTrendData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Completion Rate %',
      data: [79, 81, 82, 84, 85, 86.5],
      backgroundColor: 'rgba(52, 211, 153, 0.2)',
      borderColor: 'rgb(52, 211, 153)',
      borderWidth: 2,
      tension: 0.3,
      fill: true,
    },
    {
      label: 'Target',
      data: [100, 100, 100, 100, 100, 100],
      backgroundColor: 'rgba(0, 0, 0, 0)',
      borderColor: 'rgba(0, 0, 0, 0.2)',
      borderWidth: 2,
      borderDash: [5, 5],
    },
  ],
};

// Simulated department training completion data for bar chart
const departmentTrainingData = {
  labels: ['Operations', 'Maintenance', 'Safety', 'HR', 'Administration', 'Logistics'],
  datasets: [
    {
      label: 'Completion Rate %',
      data: [90, 82, 95, 98, 88, 79],
      backgroundColor: [
        'rgba(52, 211, 153, 0.7)',
        'rgba(250, 204, 21, 0.7)',
        'rgba(56, 189, 248, 0.7)',
        'rgba(167, 139, 250, 0.7)',
        'rgba(251, 146, 60, 0.7)',
        'rgba(251, 113, 133, 0.7)',
      ],
      borderColor: [
        'rgb(52, 211, 153)',
        'rgb(250, 204, 21)',
        'rgb(56, 189, 248)',
        'rgb(167, 139, 250)',
        'rgb(251, 146, 60)',
        'rgb(251, 113, 133)',
      ],
      borderWidth: 1,
    },
  ],
};

// Simulated training type distribution data for pie chart
const trainingTypeData = {
  labels: ['Safety Training', 'Compliance', 'Technical Skills', 'Soft Skills', 'Leadership', 'Other'],
  datasets: [
    {
      label: 'Training Hours by Type',
      data: [42, 25, 18, 12, 8, 5],
      backgroundColor: [
        'rgba(239, 68, 68, 0.7)',
        'rgba(249, 115, 22, 0.7)',
        'rgba(234, 179, 8, 0.7)',
        'rgba(16, 185, 129, 0.7)',
        'rgba(99, 102, 241, 0.7)',
        'rgba(168, 85, 247, 0.7)',
      ],
      borderColor: [
        'rgb(239, 68, 68)',
        'rgb(249, 115, 22)',
        'rgb(234, 179, 8)',
        'rgb(16, 185, 129)',
        'rgb(99, 102, 241)',
        'rgb(168, 85, 247)',
      ],
      borderWidth: 1,
    },
  ],
};

// Simulated training records data
const trainingRecords = [
  { 
    id: 'TR-001', 
    employeeId: 'EMP-1042',
    employeeName: 'John Smith',
    department: 'Operations',
    trainingType: 'Safety Training',
    trainingName: 'Defensive Driving',
    status: 'Completed',
    completionDate: '2023-05-15',
    expirationDate: '2024-05-15',
    score: 92,
    requiredBy: 'Company Policy',
    assignedBy: 'Sarah Johnson',
  },
  { 
    id: 'TR-002', 
    employeeId: 'EMP-2156',
    employeeName: 'Mary Johnson',
    department: 'Operations',
    trainingType: 'Safety Training',
    trainingName: 'Hazardous Materials Handling',
    status: 'In Progress',
    completionDate: null,
    expirationDate: null,
    score: null,
    requiredBy: 'DOT Regulation',
    assignedBy: 'Thomas Anderson',
  },
  { 
    id: 'TR-003', 
    employeeId: 'EMP-3821',
    employeeName: 'Robert Garcia',
    department: 'Maintenance',
    trainingType: 'Technical Skills',
    trainingName: 'Vehicle Maintenance Certification',
    status: 'Completed',
    completionDate: '2023-04-10',
    expirationDate: '2025-04-10',
    score: 88,
    requiredBy: 'Company Policy',
    assignedBy: 'James Wilson',
  },
  { 
    id: 'TR-004', 
    employeeId: 'EMP-4972',
    employeeName: 'Sarah Williams',
    department: 'HR',
    trainingType: 'Compliance',
    trainingName: 'HR Compliance Training',
    status: 'Completed',
    completionDate: '2023-06-02',
    expirationDate: '2024-06-02',
    score: 95,
    requiredBy: 'Federal Regulation',
    assignedBy: 'Elizabeth Taylor',
  },
  { 
    id: 'TR-005', 
    employeeId: 'EMP-5384',
    employeeName: 'Michael Brown',
    department: 'Operations',
    trainingType: 'Safety Training',
    trainingName: 'First Aid and CPR',
    status: 'Expired',
    completionDate: '2022-05-20',
    expirationDate: '2023-05-20',
    score: 90,
    requiredBy: 'OSHA Requirement',
    assignedBy: 'Sarah Johnson',
  },
  { 
    id: 'TR-006', 
    employeeId: 'EMP-7569',
    employeeName: 'Jennifer Lopez',
    department: 'Administration',
    trainingType: 'Compliance',
    trainingName: 'Data Privacy and Security',
    status: 'Completed',
    completionDate: '2023-03-15',
    expirationDate: '2024-03-15',
    score: 98,
    requiredBy: 'Company Policy',
    assignedBy: 'Thomas Anderson',
  },
  { 
    id: 'TR-007', 
    employeeId: 'EMP-4217',
    employeeName: 'William Davis',
    department: 'Logistics',
    trainingType: 'Technical Skills',
    trainingName: 'Forklift Operation',
    status: 'Expiring Soon',
    completionDate: '2022-07-10',
    expirationDate: '2023-07-10',
    score: 85,
    requiredBy: 'OSHA Requirement',
    assignedBy: 'James Wilson',
  },
  { 
    id: 'TR-008', 
    employeeId: 'EMP-6392',
    employeeName: 'Daniel White',
    department: 'Maintenance',
    trainingType: 'Safety Training',
    trainingName: 'Electrical Safety',
    status: 'Not Started',
    completionDate: null,
    expirationDate: null,
    score: null,
    requiredBy: 'Company Policy',
    assignedBy: 'Sarah Johnson',
  },
  { 
    id: 'TR-009', 
    employeeId: 'EMP-8241',
    employeeName: 'Christopher Taylor',
    department: 'Safety',
    trainingType: 'Leadership',
    trainingName: 'Safety Leadership',
    status: 'Completed',
    completionDate: '2023-02-28',
    expirationDate: '2024-02-28',
    score: 94,
    requiredBy: 'Company Policy',
    assignedBy: 'Elizabeth Taylor',
  },
  { 
    id: 'TR-010', 
    employeeId: 'EMP-3712',
    employeeName: 'Michael Jones',
    department: 'Operations',
    trainingType: 'Technical Skills',
    trainingName: 'Advanced Vehicle Operations',
    status: 'Overdue',
    completionDate: null,
    expirationDate: '2023-05-01',
    score: null,
    requiredBy: 'Company Policy',
    assignedBy: 'Thomas Anderson',
  },
];

// Table columns definition
const trainingColumns = [
  { header: 'ID', accessorKey: 'id', sortable: true },
  { header: 'Employee', accessorKey: 'employeeName', sortable: true },
  { header: 'Department', accessorKey: 'department', sortable: true },
  { header: 'Training', accessorKey: 'trainingName', sortable: true },
  { header: 'Type', accessorKey: 'trainingType', sortable: true },
  { 
    header: 'Status', 
    accessorKey: 'status', 
    sortable: true,
    cell: ({ row }) => {
      const status = row.status;
      let colorClass = 'bg-gray-100 text-gray-800';
      let icon = null;
      
      if (status === 'Completed') {
        colorClass = 'bg-green-100 text-green-800';
        icon = <FiCheck className="mr-1 h-3 w-3" />;
      } else if (status === 'In Progress') {
        colorClass = 'bg-blue-100 text-blue-800';
        icon = <FiClock className="mr-1 h-3 w-3" />;
      } else if (status === 'Expiring Soon') {
        colorClass = 'bg-yellow-100 text-yellow-800';
        icon = <FiAlertCircle className="mr-1 h-3 w-3" />;
      } else if (status === 'Expired' || status === 'Overdue') {
        colorClass = 'bg-red-100 text-red-800';
        icon = <FiX className="mr-1 h-3 w-3" />;
      } else if (status === 'Not Started') {
        colorClass = 'bg-gray-100 text-gray-800';
        icon = <FiClock className="mr-1 h-3 w-3" />;
      }
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs flex items-center ${colorClass}`}>
          {icon}
          {status}
        </span>
      );
    }
  },
  { 
    header: 'Completion Date', 
    accessorKey: 'completionDate', 
    sortable: true,
    cell: ({ row }) => {
      return row.completionDate || '—';
    }
  },
  { 
    header: 'Expiration Date', 
    accessorKey: 'expirationDate', 
    sortable: true,
    cell: ({ row }) => {
      const date = row.expirationDate;
      if (!date) return '—';
      
      // Check if expiring within 30 days
      const expirationDate = new Date(date);
      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(now.getDate() + 30);
      
      let colorClass = '';
      if (expirationDate < now) {
        colorClass = 'text-red-600 font-medium';
      } else if (expirationDate <= thirtyDaysFromNow) {
        colorClass = 'text-yellow-600 font-medium';
      }
      
      return (
        <span className={colorClass}>
          {date}
        </span>
      );
    }
  },
  { 
    header: 'Score', 
    accessorKey: 'score', 
    sortable: true,
    cell: ({ row }) => {
      const score = row.score;
      if (!score) return '—';
      
      let colorClass = 'text-gray-800';
      if (score >= 90) colorClass = 'text-success-600 font-medium';
      else if (score >= 80) colorClass = 'text-warning-600';
      else colorClass = 'text-danger-600 font-medium';
      
      return (
        <span className={colorClass}>
          {score}
        </span>
      );
    }
  },
];

export default function TrainingPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: 'Demo User', email: 'demo@example.com' });
  const [showImportModal, setShowImportModal] = useState(false);
  
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleRowClick = (record) => {
    // This would navigate to a training record detail page in a real application
    console.log('Training record selected:', record);
    // router.push(`/training/${record.id}`);
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
            totalRows: 20,
            imported: 15,
            updated: 5,
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
          <p className="text-lg">Loading training data...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Page header */}
          <div className="sm:flex sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Training Dashboard</h1>
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
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <select
                    id="department"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    defaultValue=""
                  >
                    <option value="">All Departments</option>
                    <option value="Operations">Operations</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Safety">Safety</option>
                    <option value="HR">HR</option>
                    <option value="Administration">Administration</option>
                    <option value="Logistics">Logistics</option>
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
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Expiring Soon">Expiring Soon</option>
                    <option value="Expired">Expired</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Not Started">Not Started</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="training-type" className="block text-sm font-medium text-gray-700">
                    Training Type
                  </label>
                  <select
                    id="training-type"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    defaultValue=""
                  >
                    <option value="">All Types</option>
                    <option value="Safety Training">Safety Training</option>
                    <option value="Compliance">Compliance</option>
                    <option value="Technical Skills">Technical Skills</option>
                    <option value="Soft Skills">Soft Skills</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Chart
              title="Training Completion Rate Trend (Last 6 Months)"
              type="line"
              data={trainingCompletionTrendData}
              description="Overall training completion percentage over time"
              downloadFileName="training_completion_trend"
            />
            <Chart
              title="Training Completion by Department"
              type="bar"
              data={departmentTrainingData}
              description="Current training completion rate by department"
              downloadFileName="department_training"
            />
          </div>

          <div className="grid grid-cols-1 gap-5">
            <Chart
              title="Training Hours by Type"
              type="pie"
              data={trainingTypeData}
              description="Distribution of training hours by training type"
              downloadFileName="training_type_distribution"
            />
          </div>

          {/* Upcoming Expirations - High Priority Items */}
          <div className="bg-white shadow rounded-lg p-4 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Certification Expirations (Next 30 Days)</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">ID</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Employee</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Department</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Training</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Expiration Date</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {trainingRecords
                    .filter(record => {
                      if (!record.expirationDate) return false;
                      const expirationDate = new Date(record.expirationDate);
                      const now = new Date();
                      const thirtyDaysFromNow = new Date();
                      thirtyDaysFromNow.setDate(now.getDate() + 30);
                      return expirationDate <= thirtyDaysFromNow && expirationDate >= now;
                    })
                    .map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(record)}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{record.id}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{record.employeeName}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{record.department}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{record.trainingName}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-yellow-600 font-medium">{record.expirationDate}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className="px-2 py-1 rounded-full text-xs inline-flex items-center bg-yellow-100 text-yellow-800">
                            <FiAlertCircle className="mr-1 h-3 w-3" />
                            Expiring Soon
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Training Records Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <DataTable
              data={trainingRecords}
              columns={trainingColumns}
              title="Training Records"
              showSearch={true}
              showDownload={true}
              downloadFileName="training_records"
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
                      Import Training Data
                    </h3>
                    <div className="mt-4">
                      <FileUpload 
                        onUpload={handleImportData} 
                        accept=".xlsx,.xls,.csv"
                        title="Upload Training Records"
                        successMessage="Training data successfully processed"
                        endpoint="/api/import/training-records"
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