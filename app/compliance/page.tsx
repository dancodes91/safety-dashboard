'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DataTable from '@/components/DataTable';
import KpiStatusCard, { StatusType } from '@/components/KpiStatusCard';
import Chart from '@/components/Chart';
import FileUpload from '@/components/FileUpload';
import { FiFilter, FiCalendar, FiDownload, FiUpload, FiCheck, FiX, FiClock, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { DataService } from '@/lib/dataService';
import { useDataSource } from '@/lib/context/DataSourceContext';

// Simulated regulatory requirements data (will be moved to mockData.ts)
const mockRegulations = [
  { 
    id: 'REG-001', 
    title: 'DOT Hours of Service Compliance',
    category: 'Operations',
    deadline: '2023-07-15',
    status: 'Compliant',
    responsibleParty: 'Operations Director',
    completionDate: '2023-05-28',
    notes: 'All driver logs verified and up to date. Electronic logging system fully implemented.',
    documents: 3,
  },
  { 
    id: 'REG-002', 
    title: 'Hazardous Materials Handling Certification',
    category: 'Safety',
    deadline: '2023-08-10',
    status: 'In Progress',
    responsibleParty: 'Safety Manager',
    completionDate: null,
    notes: 'Training scheduled for all relevant employees. 60% completed.',
    documents: 5,
  },
  { 
    id: 'REG-003', 
    title: 'Vehicle Maintenance Records',
    category: 'Maintenance',
    deadline: '2023-06-30',
    status: 'Attention Required',
    responsibleParty: 'Fleet Manager',
    completionDate: null,
    notes: 'Missing service records for 3 vehicles. Scheduled for completion by June 25.',
    documents: 2,
  },
  { 
    id: 'REG-004', 
    title: 'Driver Qualification Files',
    category: 'HR',
    deadline: '2023-07-01',
    status: 'Compliant',
    responsibleParty: 'HR Director',
    completionDate: '2023-06-10',
    notes: 'All driver files complete and up to date with required documentation.',
    documents: 8,
  },
  { 
    id: 'REG-005', 
    title: 'Drug & Alcohol Testing Program',
    category: 'Safety',
    deadline: '2023-06-15',
    status: 'Compliant',
    responsibleParty: 'Safety Manager',
    completionDate: '2023-06-01',
    notes: 'Random testing program ongoing. All records up to date.',
    documents: 4,
  },
  { 
    id: 'REG-006', 
    title: 'Environmental Compliance Audit',
    category: 'Administration',
    deadline: '2023-09-01',
    status: 'Not Started',
    responsibleParty: 'Compliance Officer',
    completionDate: null,
    notes: 'Scheduled to begin July 15. External auditor contracted.',
    documents: 0,
  },
  { 
    id: 'REG-007', 
    title: 'OSHA Safety Reporting',
    category: 'Safety',
    deadline: '2023-07-30',
    status: 'In Progress',
    responsibleParty: 'Safety Manager',
    completionDate: null,
    notes: 'Data collection underway. 75% complete.',
    documents: 6,
  },
  { 
    id: 'REG-008', 
    title: 'Commercial Driver\'s License Verification',
    category: 'HR',
    deadline: '2023-06-20',
    status: 'Compliant',
    responsibleParty: 'HR Director',
    completionDate: '2023-06-05',
    notes: 'All CDLs verified and documented. System set up for automatic expiration alerts.',
    documents: 3,
  },
];

// Table columns definition
const regulationColumns = [
  { header: 'ID', accessorKey: 'id', sortable: true },
  { header: 'Title', accessorKey: 'title', sortable: true },
  { header: 'Category', accessorKey: 'category', sortable: true },
  { header: 'Deadline', accessorKey: 'deadline', sortable: true },
  { 
    header: 'Status', 
    accessorKey: 'status', 
    sortable: true,
    cell: ({ row }: { row: any }) => {
      const status = row.status;
      let colorClass = 'bg-gray-100 text-gray-800';
      let icon = null;
      
      if (status === 'Compliant') {
        colorClass = 'bg-green-100 text-green-800';
        icon = <FiCheck className="mr-1 h-3 w-3" />;
      } else if (status === 'In Progress') {
        colorClass = 'bg-blue-100 text-blue-800';
        icon = <FiClock className="mr-1 h-3 w-3" />;
      } else if (status === 'Attention Required') {
        colorClass = 'bg-yellow-100 text-yellow-800';
        icon = <FiClock className="mr-1 h-3 w-3" />;
      } else if (status === 'Not Started') {
        colorClass = 'bg-red-100 text-red-800';
        icon = <FiX className="mr-1 h-3 w-3" />;
      }
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs flex items-center ${colorClass}`}>
          {icon}
          {status}
        </span>
      );
    }
  },
  { header: 'Responsible Party', accessorKey: 'responsibleParty', sortable: true },
  { 
    header: 'Documents', 
    accessorKey: 'documents', 
    sortable: true,
    cell: ({ row }: { row: any }) => {
      const count = row.documents;
      return (
        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
          {count}
        </span>
      );
    }
  },
  { 
    header: 'Completion Date', 
    accessorKey: 'completionDate', 
    sortable: true,
    cell: ({ row }: { row: any }) => {
      return row.completionDate || '—';
    }
  },
];

export default function CompliancePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: 'Demo User', email: 'demo@example.com' });
  const [showImportModal, setShowImportModal] = useState(false);
  const [kpiData, setKpiData] = useState<any[]>([]);
  const [complianceTrendData, setComplianceTrendData] = useState<any>(null);
  const [departmentComplianceData, setDepartmentComplianceData] = useState<any>(null);
  const [regulations, setRegulations] = useState<any[]>([]);
  
  const { useMockData, toggleDataSource } = useDataSource();

  useEffect(() => {
    loadComplianceData();
  }, [useMockData]);

  const loadComplianceData = async () => {
    try {
      setLoading(true);
      const [kpis, trendData, deptData, regulationsData] = await Promise.all([
        DataService.getComplianceKpis(),
        DataService.getComplianceChartData('trend'),
        DataService.getComplianceChartData('department'),
        DataService.getRegulations()
      ]);
      
      setKpiData(kpis);
      setComplianceTrendData(trendData);
      setDepartmentComplianceData(deptData);
      setRegulations(regulationsData);
    } catch (error) {
      console.error('Error loading compliance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (regulation: any) => {
    // This would navigate to a regulation detail page in a real application
    console.log('Regulation selected:', regulation);
    // router.push(`/compliance/${regulation.id}`);
  };

  const handleImportData = async (file: File) => {
    // In a real application, this would send the file to the API
    console.log('Importing file:', file);
    
    // Simulate API response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          message: 'File processed successfully',
          result: {
            totalRows: 12,
            imported: 8,
            updated: 4,
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
          <p className="text-lg">Loading compliance data...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Page header */}
          <div className="sm:flex sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Compliance Dashboard</h1>
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
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    id="category"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    defaultValue=""
                  >
                    <option value="">All Categories</option>
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
                    <option value="Compliant">Compliant</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Attention Required">Attention Required</option>
                    <option value="Not Started">Not Started</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="date-range" className="block text-sm font-medium text-gray-700">
                    Deadline Range
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
                      placeholder="Next 30 days"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Chart
              title="Compliance Trend (Last 6 Months)"
              type="line"
              data={complianceTrendData}
              description="Overall compliance percentage over time"
            />
            <Chart
              title="Compliance by Department"
              type="bar"
              data={departmentComplianceData}
              description="Current compliance score by department"
            />
          </div>

          {/* Upcoming Deadlines - High Priority Items */}
          <div className="bg-white shadow rounded-lg p-4 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Deadlines (Next 30 Days)</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">ID</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Title</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Deadline</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Responsible Party</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {regulations
                    .filter(reg => {
                      const deadline = new Date(reg.deadline);
                      const now = new Date();
                      const thirtyDaysFromNow = new Date();
                      thirtyDaysFromNow.setDate(now.getDate() + 30);
                      return deadline <= thirtyDaysFromNow && deadline >= now;
                    })
                    .map((regulation) => (
                      <tr key={regulation.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(regulation)}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{regulation.id}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{regulation.title}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{regulation.category}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{regulation.deadline}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs inline-flex items-center ${
                            regulation.status === 'Compliant' ? 'bg-green-100 text-green-800' :
                            regulation.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            regulation.status === 'Attention Required' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {regulation.status === 'Compliant' && <FiCheck className="mr-1 h-3 w-3" />}
                            {regulation.status === 'In Progress' && <FiClock className="mr-1 h-3 w-3" />}
                            {regulation.status === 'Attention Required' && <FiClock className="mr-1 h-3 w-3" />}
                            {regulation.status === 'Not Started' && <FiX className="mr-1 h-3 w-3" />}
                            {regulation.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{regulation.responsibleParty}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Regulations Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <DataTable
              data={regulations}
              columns={regulationColumns}
              title="Regulatory Requirements"
              showSearch={true}
              showDownload={true}
              downloadFileName="regulatory_requirements"
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
                      Import Compliance Data
                    </h3>
                    <div className="mt-4">
                      <FileUpload 
                        onUpload={handleImportData} 
                        accept=".xlsx,.xls,.csv"
                        title="Upload Compliance Records"
                        successMessage="Compliance data successfully processed"
                        endpoint="/api/import/compliance-records"
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
