'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DataTable from '@/components/DataTable';
import { FiEdit2, FiTrash2, FiPlus, FiBarChart2, FiTarget, FiFilter } from 'react-icons/fi';
import Link from 'next/link';

// Simulated KPI data
const sampleKpiGoals = [
  {
    id: 'kpi-001',
    metricName: 'Preventable Incidents',
    description: 'Number of preventable incidents per month',
    targetValue: 0,
    yellowThreshold: 2,
    redThreshold: 5,
    unit: 'incidents',
    division: 'All',
    plant: 'All',
    applicableTo: 'Company',
    effectiveDate: '2025-01-01',
    expirationDate: '2025-12-31',
    currentValue: 3,
    status: 'yellow',
  },
  {
    id: 'kpi-002',
    metricName: 'Average Safety Score',
    description: 'Average driver safety score across fleet',
    targetValue: 95,
    yellowThreshold: 90,
    redThreshold: 85,
    unit: 'score',
    division: 'Operations',
    plant: 'All',
    applicableTo: 'Drivers',
    effectiveDate: '2025-01-01',
    expirationDate: '2025-12-31',
    currentValue: 92,
    status: 'yellow',
  },
  {
    id: 'kpi-003',
    metricName: 'Training Compliance',
    description: 'Percentage of employees with up-to-date training',
    targetValue: 100,
    yellowThreshold: 95,
    redThreshold: 90,
    unit: '%',
    division: 'All',
    plant: 'All',
    applicableTo: 'All Employees',
    effectiveDate: '2025-01-01',
    expirationDate: '2025-12-31',
    currentValue: 96,
    status: 'yellow',
  },
  {
    id: 'kpi-004',
    metricName: 'Speeding Events',
    description: 'Number of speeding events per week',
    targetValue: 0,
    yellowThreshold: 10,
    redThreshold: 20,
    unit: 'events',
    division: 'Operations',
    plant: 'All',
    applicableTo: 'Drivers',
    effectiveDate: '2025-01-01',
    expirationDate: '2025-12-31',
    currentValue: 15,
    status: 'yellow',
  },
  {
    id: 'kpi-005',
    metricName: 'Harsh Driving Events',
    description: 'Number of harsh acceleration, braking, or turning events per week',
    targetValue: 5,
    yellowThreshold: 15,
    redThreshold: 30,
    unit: 'events',
    division: 'Operations',
    plant: 'All',
    applicableTo: 'Drivers',
    effectiveDate: '2025-01-01',
    expirationDate: '2025-12-31',
    currentValue: 12,
    status: 'green',
  },
  {
    id: 'kpi-006',
    metricName: 'Incident Investigation Completion',
    description: 'Percentage of incident investigations completed within 7 days',
    targetValue: 100,
    yellowThreshold: 90,
    redThreshold: 80,
    unit: '%',
    division: 'Safety',
    plant: 'All',
    applicableTo: 'Safety Team',
    effectiveDate: '2025-01-01',
    expirationDate: '2025-12-31',
    currentValue: 85,
    status: 'yellow',
  },
  {
    id: 'kpi-007',
    metricName: 'Vehicle Inspection Compliance',
    description: 'Percentage of vehicle inspections completed on time',
    targetValue: 100,
    yellowThreshold: 95,
    redThreshold: 90,
    unit: '%',
    division: 'Maintenance',
    plant: 'All',
    applicableTo: 'Maintenance Team',
    effectiveDate: '2025-01-01',
    expirationDate: '2025-12-31',
    currentValue: 98,
    status: 'green',
  },
  {
    id: 'kpi-008',
    metricName: 'Safety Meeting Attendance',
    description: 'Percentage of employees attending monthly safety meetings',
    targetValue: 100,
    yellowThreshold: 90,
    redThreshold: 80,
    unit: '%',
    division: 'All',
    plant: 'All',
    applicableTo: 'All Employees',
    effectiveDate: '2025-01-01',
    expirationDate: '2025-12-31',
    currentValue: 92,
    status: 'yellow',
  },
  {
    id: 'kpi-009',
    metricName: 'Near Miss Reporting',
    description: 'Number of near misses reported per month',
    targetValue: 10,
    yellowThreshold: 5,
    redThreshold: 2,
    unit: 'reports',
    division: 'All',
    plant: 'All',
    applicableTo: 'All Employees',
    effectiveDate: '2025-01-01',
    expirationDate: '2025-12-31',
    currentValue: 8,
    status: 'yellow',
  },
  {
    id: 'kpi-010',
    metricName: 'Safety Audit Score',
    description: 'Average score on monthly safety audits',
    targetValue: 100,
    yellowThreshold: 90,
    redThreshold: 80,
    unit: '%',
    division: 'All',
    plant: 'All',
    applicableTo: 'Company',
    effectiveDate: '2025-01-01',
    expirationDate: '2025-12-31',
    currentValue: 94,
    status: 'yellow',
  },
  {
    id: 'kpi-011',
    metricName: 'Distracted Driving Events',
    description: 'Number of distracted driving events per week',
    targetValue: 0,
    yellowThreshold: 5,
    redThreshold: 10,
    unit: 'events',
    division: 'Operations',
    plant: 'All',
    applicableTo: 'Drivers',
    effectiveDate: '2025-01-01',
    expirationDate: '2025-12-31',
    currentValue: 3,
    status: 'yellow',
  },
  {
    id: 'kpi-012',
    metricName: 'Compliance Violations',
    description: 'Number of regulatory compliance violations per quarter',
    targetValue: 0,
    yellowThreshold: 1,
    redThreshold: 3,
    unit: 'violations',
    division: 'All',
    plant: 'All',
    applicableTo: 'Company',
    effectiveDate: '2025-01-01',
    expirationDate: '2025-12-31',
    currentValue: 0,
    status: 'green',
  },
];

// Define the KPI type
type KpiGoal = {
  id: string;
  metricName: string;
  description: string;
  targetValue: number;
  yellowThreshold: number;
  redThreshold: number;
  unit: string;
  division: string;
  plant: string;
  applicableTo: string;
  effectiveDate: string;
  expirationDate: string;
  currentValue: number;
  status: string;
};

export default function KpiManagementPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: 'Admin User', email: 'admin@example.com' });
  const [kpiGoals, setKpiGoals] = useState<KpiGoal[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingKpi, setEditingKpi] = useState<KpiGoal | null>(null);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setKpiGoals(sampleKpiGoals);
      setLoading(false);
    }, 1000);
  }, []);

  // Table columns definition
  const kpiColumns = [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: 'Metric Name', accessorKey: 'metricName', sortable: true },
    { header: 'Target', 
      accessorKey: 'targetValue', 
      sortable: true,
      cell: ({ row }: { row: KpiGoal }) => {
        return `${row.targetValue}${row.unit ? ' ' + row.unit : ''}`;
      }
    },
    { header: 'Yellow Threshold', 
      accessorKey: 'yellowThreshold', 
      sortable: true,
      cell: ({ row }: { row: KpiGoal }) => {
        return `${row.yellowThreshold}${row.unit ? ' ' + row.unit : ''}`;
      }
    },
    { header: 'Red Threshold', 
      accessorKey: 'redThreshold', 
      sortable: true,
      cell: ({ row }: { row: KpiGoal }) => {
        return `${row.redThreshold}${row.unit ? ' ' + row.unit : ''}`;
      }
    },
    { header: 'Current Value', 
      accessorKey: 'currentValue', 
      sortable: true,
      cell: ({ row }: { row: KpiGoal }) => {
        const status = row.status;
        let colorClass = 'text-gray-800';
        
        if (status === 'green') colorClass = 'text-success-600 font-semibold';
        else if (status === 'yellow') colorClass = 'text-warning-600 font-semibold';
        else if (status === 'red') colorClass = 'text-danger-600 font-semibold';
        
        return (
          <span className={colorClass}>
            {row.currentValue}{row.unit ? ' ' + row.unit : ''}
          </span>
        );
      }
    },
    { header: 'Division', accessorKey: 'division', sortable: true },
    { header: 'Applicable To', accessorKey: 'applicableTo', sortable: true },
    { header: 'Effective Date', accessorKey: 'effectiveDate', sortable: true },
    { 
      header: 'Actions',
      accessorKey: 'id',
      cell: ({ row }: { row: KpiGoal }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditKpi(row)}
            className="p-1 text-blue-600 hover:text-blue-800"
          >
            <FiEdit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteKpi(row.id)}
            className="p-1 text-red-600 hover:text-red-800"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      )
    },
  ];

  const handleEditKpi = (kpi: KpiGoal) => {
    setEditingKpi(kpi);
    setShowAddModal(true);
  };

  const handleDeleteKpi = (id: string) => {
    // In a real app, this would call an API
    setKpiGoals(kpiGoals.filter(kpi => kpi.id !== id));
  };

  const handleAddKpi = () => {
    setEditingKpi(null);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingKpi(null);
  };

  // This would be expanded in a real app
  const handleSaveKpi = (kpiData: Partial<KpiGoal>) => {
    // In a real app, this would call an API
    if (editingKpi) {
      setKpiGoals(kpiGoals.map(kpi => kpi.id === editingKpi.id ? { ...kpi, ...kpiData } : kpi));
    } else {
      const newKpi: KpiGoal = {
        id: `kpi-${String(kpiGoals.length + 1).padStart(3, '0')}`,
        plant: 'All',
        status: 'green',
        currentValue: 0,
        ...kpiData,
      } as KpiGoal;
      setKpiGoals([...kpiGoals, newKpi]);
    }
    setShowAddModal(false);
    setEditingKpi(null);
  };

  return (
    <DashboardLayout user={user}>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Loading KPI data...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Page header */}
          <div className="sm:flex sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">KPI Goal Management</h1>
            <div className="mt-3 sm:mt-0">
              <button
                type="button"
                onClick={handleAddKpi}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                Add KPI Goal
              </button>
            </div>
          </div>

          {/* Filter controls */}
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
                    <option value="Operations">Operations</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Safety">Safety</option>
                    <option value="Administration">Administration</option>
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
                    <option value="green">Green</option>
                    <option value="yellow">Yellow</option>
                    <option value="red">Red</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="applicableTo" className="block text-sm font-medium text-gray-700">
                    Applicable To
                  </label>
                  <select
                    id="applicableTo"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    defaultValue=""
                  >
                    <option value="">All Types</option>
                    <option value="Company">Company</option>
                    <option value="Drivers">Drivers</option>
                    <option value="All Employees">All Employees</option>
                    <option value="Safety Team">Safety Team</option>
                    <option value="Maintenance Team">Maintenance Team</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* KPI Goals summary */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-success-100 rounded-md p-3">
                    <FiTarget className="h-6 w-6 text-success-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Green Status KPIs</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {kpiGoals.filter(kpi => kpi.status === 'green').length}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-warning-100 rounded-md p-3">
                    <FiTarget className="h-6 w-6 text-warning-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Yellow Status KPIs</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {kpiGoals.filter(kpi => kpi.status === 'yellow').length}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-danger-100 rounded-md p-3">
                    <FiTarget className="h-6 w-6 text-danger-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Red Status KPIs</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {kpiGoals.filter(kpi => kpi.status === 'red').length}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KPI Goals Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <DataTable
              data={kpiGoals}
              columns={kpiColumns}
              title="KPI Goals"
              showSearch={true}
              showDownload={true}
              downloadFileName="kpi_goals"
              className="rounded-lg shadow"
            />
          </div>
        </div>
      )}

      {/* Add/Edit KPI Modal - would be expanded in a real app */}
      {showAddModal && (
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
                      {editingKpi ? 'Edit KPI Goal' : 'Add New KPI Goal'}
                    </h3>
                    <div className="mt-4">
                      <form className="space-y-4">
                        <div>
                          <label htmlFor="metricName" className="block text-sm font-medium text-gray-700">
                            Metric Name
                          </label>
                          <input
                            type="text"
                            name="metricName"
                            id="metricName"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            defaultValue={editingKpi?.metricName || ''}
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            name="description"
                            id="description"
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            defaultValue={editingKpi?.description || ''}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                          <div>
                            <label htmlFor="targetValue" className="block text-sm font-medium text-gray-700">
                              Target Value
                            </label>
                            <input
                              type="number"
                              name="targetValue"
                              id="targetValue"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              defaultValue={editingKpi?.targetValue || ''}
                            />
                          </div>
                          <div>
                            <label htmlFor="yellowThreshold" className="block text-sm font-medium text-gray-700">
                              Yellow Threshold
                            </label>
                            <input
                              type="number"
                              name="yellowThreshold"
                              id="yellowThreshold"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              defaultValue={editingKpi?.yellowThreshold || ''}
                            />
                          </div>
                          <div>
                            <label htmlFor="redThreshold" className="block text-sm font-medium text-gray-700">
                              Red Threshold
                            </label>
                            <input
                              type="number"
                              name="redThreshold"
                              id="redThreshold"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              defaultValue={editingKpi?.redThreshold || ''}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                              Unit
                            </label>
                            <input
                              type="text"
                              name="unit"
                              id="unit"
                              placeholder="%, incidents, etc."
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              defaultValue={editingKpi?.unit || ''}
                            />
                          </div>
                          <div>
                            <label htmlFor="division" className="block text-sm font-medium text-gray-700">
                              Division
                            </label>
                            <select
                              id="division"
                              name="division"
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                              defaultValue={editingKpi?.division || 'All'}
                            >
                              <option>All</option>
                              <option>Operations</option>
                              <option>Maintenance</option>
                              <option>Safety</option>
                              <option>Administration</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="applicableTo" className="block text-sm font-medium text-gray-700">
                            Applicable To
                          </label>
                          <select
                            id="applicableTo"
                            name="applicableTo"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                            defaultValue={editingKpi?.applicableTo || 'Company'}
                          >
                            <option>Company</option>
                            <option>Drivers</option>
                            <option>All Employees</option>
                            <option>Safety Team</option>
                            <option>Maintenance Team</option>
                          </select>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700">
                              Effective Date
                            </label>
                            <input
                              type="date"
                              name="effectiveDate"
                              id="effectiveDate"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              defaultValue={editingKpi?.effectiveDate || '2025-01-01'}
                            />
                          </div>
                          <div>
                            <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700">
                              Expiration Date
                            </label>
                            <input
                              type="date"
                              name="expirationDate"
                              id="expirationDate"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              defaultValue={editingKpi?.expirationDate || '2025-12-31'}
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => handleSaveKpi({
                    // In a real app, this would gather form values properly
                    metricName: (document.getElementById('metricName') as HTMLInputElement)?.value || '',
                    description: (document.getElementById('description') as HTMLTextAreaElement)?.value || '',
                    targetValue: parseFloat((document.getElementById('targetValue') as HTMLInputElement)?.value || '0'),
                    yellowThreshold: parseFloat((document.getElementById('yellowThreshold') as HTMLInputElement)?.value || '0'),
                    redThreshold: parseFloat((document.getElementById('redThreshold') as HTMLInputElement)?.value || '0'),
                    unit: (document.getElementById('unit') as HTMLInputElement)?.value || '',
                    division: (document.getElementById('division') as HTMLSelectElement)?.value || 'All',
                    applicableTo: (document.getElementById('applicableTo') as HTMLSelectElement)?.value || 'Company',
                    effectiveDate: (document.getElementById('effectiveDate') as HTMLInputElement)?.value || '2025-01-01',
                    expirationDate: (document.getElementById('expirationDate') as HTMLInputElement)?.value || '2025-12-31',
                  })}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
