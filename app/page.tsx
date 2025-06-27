'use client';

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would fetch initial dashboard data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Safety Dashboard</h1>
            <div className="flex items-center gap-4">
              {/* User menu will go here */}
              <div className="bg-white p-2 rounded-full shadow">
                <span className="sr-only">User menu</span>
                <div className="h-8 w-8 rounded-full bg-primary-500"></div>
              </div>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-lg">Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="card">
                <h3 className="text-lg font-medium mb-2">Incidents</h3>
                <p className="text-3xl font-bold">0</p>
              </div>
              <div className="card">
                <h3 className="text-lg font-medium mb-2">Drivers</h3>
                <p className="text-3xl font-bold">0</p>
              </div>
              <div className="card">
                <h3 className="text-lg font-medium mb-2">Compliance</h3>
                <p className="text-3xl font-bold">0%</p>
              </div>
              <div className="card">
                <h3 className="text-lg font-medium mb-2">Training</h3>
                <p className="text-3xl font-bold">0%</p>
              </div>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="card h-80">
                <h3 className="text-lg font-medium mb-4">Incident Trend</h3>
                <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                  <p className="text-gray-500">Line chart will appear here</p>
                </div>
              </div>
              <div className="card h-80">
                <h3 className="text-lg font-medium mb-4">Driver Safety Scores</h3>
                <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                  <p className="text-gray-500">Bar chart will appear here</p>
                </div>
              </div>
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
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">No data</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Event Types and Training Compliance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card h-80">
                <h3 className="text-lg font-medium mb-4">Event Types</h3>
                <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                  <p className="text-gray-500">Pie chart will appear here</p>
                </div>
              </div>
              <div className="card h-80">
                <h3 className="text-lg font-medium mb-4">Training Compliance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Safety Training</span>
                      <span className="text-sm font-medium">0%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-success-600 h-2.5 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Equipment Training</span>
                      <span className="text-sm font-medium">0%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-success-600 h-2.5 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Compliance Training</span>
                      <span className="text-sm font-medium">0%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-success-600 h-2.5 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}