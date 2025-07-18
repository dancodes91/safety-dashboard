'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DataTable from '@/components/DataTable';
import KpiStatusCard, { StatusType } from '@/components/KpiStatusCard';
import Chart from '@/components/Chart';
import FileUpload from '@/components/FileUpload';
import { FiFilter, FiCalendar, FiDownload, FiUpload, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { DataService } from '@/lib/dataService';
import { useDataSource } from '@/lib/context/DataSourceContext';
import { KpaEvent } from '@/types/KpaEvent';



// Table columns definition
const incidentColumns = [
  { header: 'Report #', accessorKey: 'reportNumber', sortable: true },
  { 
    header: 'Date', 
    accessorKey: 'dateTime', 
    sortable: true,
    cell: ({ row }: { row: any }) => {
      const date = new Date(row.dateTime);
      return date.toLocaleDateString();
    }
  },
  { header: 'Employee', accessorKey: 'employeeName', sortable: true },
  { header: 'Division', accessorKey: 'division', sortable: true },
  { header: 'Location', accessorKey: 'location', sortable: true },
  { header: 'Event Category', accessorKey: 'eventCategory', sortable: true },
  { 
    header: 'Severity', 
    accessorKey: 'severityRating', 
    sortable: true, 
    cell: ({ row }: { row: any }) => {
      const severity = row.severityRating;
      let colorClass = 'bg-gray-100 text-gray-800';
      let label = 'Unknown';
      
      if (severity === 1) {
        colorClass = 'bg-green-100 text-green-800';
        label = 'Low';
      } else if (severity === 2) {
        colorClass = 'bg-yellow-100 text-yellow-800';
        label = 'Medium';
      } else if (severity >= 3) {
        colorClass = 'bg-red-100 text-red-800';
        label = 'High';
      }
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs ${colorClass}`}>
          {label}
        </span>
      );
    }
  },
  { 
    header: 'Preventability', 
    accessorKey: 'preventability', 
    sortable: true,
    cell: ({ row }: { row: any }) => {
      const preventability = row.preventability;
      let colorClass = 'bg-gray-100 text-gray-800';
      
      if (preventability === 'Preventable') colorClass = 'bg-red-100 text-red-800';
      else if (preventability === 'Non-Preventable') colorClass = 'bg-blue-100 text-blue-800';
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs ${colorClass}`}>
          {preventability}
        </span>
      );
    }
  },
];

export default function IncidentsPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: 'Demo User', email: 'demo@example.com' });
  const [showImportModal, setShowImportModal] = useState(false);
  const [incidents, setIncidents] = useState<KpaEvent[]>([]);
  const [incidentStats, setIncidentStats] = useState<any>(null);
  const [kpiData, setKpiData] = useState<any[]>([]);
  const [incidentTrendData, setIncidentTrendData] = useState<any>(null);
  const [incidentTypeData, setIncidentTypeData] = useState<any>(null);
  const [filters, setFilters] = useState({
    division: '',
    eventType: '',
    preventability: '',
    startDate: '',
    endDate: '',
  });
  
  const { useMockData, toggleDataSource } = useDataSource();

  useEffect(() => {
    loadIncidents();
    loadIncidentStats();
    loadKpiData();
    loadChartData();
  }, [useMockData, filters]);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const response = await DataService.getKpaEvents(filters);
      setIncidents(response.events);
    } catch (error) {
      console.error('Error loading incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadIncidentStats = async () => {
    try {
      const stats = await DataService.getIncidentStats();
      setIncidentStats(stats);
    } catch (error) {
      console.error('Error loading incident stats:', error);
    }
  };

  const loadKpiData = async () => {
    try {
      const kpis = await DataService.getIncidentKpis();
      setKpiData(kpis);
    } catch (error) {
      console.error('Error loading KPI data:', error);
    }
  };

  const loadChartData = async () => {
    try {
      const [trendData, typeData] = await Promise.all([
        DataService.getIncidentChartData('trend'),
        DataService.getIncidentChartData('types')
      ]);
      setIncidentTrendData(trendData);
      setIncidentTypeData(typeData);
    } catch (error) {
      console.error('Error loading chart data:', error);
    }
  };

  const handleRowClick = (incident: any) => {
    // This would navigate to an incident detail page in a real application
    console.log('Incident selected:', incident);
    // router.push(`/incidents/${incident.id}`);
  };

  const handleImportData = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/import/kpa-events', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to import data');
      }

      const result = await response.json();
      
      // Refresh the incidents data after successful import
      await loadIncidents();
      await loadIncidentStats();
      
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
          <p className="text-lg">Loading incidents data...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Page header */}
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-semibold text-gray-900">Incidents Dashboard</h1>
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
            />
            <Chart
              title="Incident Types"
              type="pie"
              data={incidentTypeData}
              description="Distribution of incidents by type"
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
