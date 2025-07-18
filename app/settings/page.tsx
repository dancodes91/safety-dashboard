'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  FiUser, 
  FiBell, 
  FiMonitor, 
  FiMail, 
  FiSave, 
  FiShield, 
  FiEye, 
  FiClock,
  FiToggleLeft,
  FiToggleRight
} from 'react-icons/fi';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ 
    name: 'John Doe', 
    email: 'john.doe@example.com',
    department: 'Safety',
    role: 'Manager',
    profileImage: null,
  });
  
  const [activeTab, setActiveTab] = useState('profile');
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    incidentAlerts: true,
    weeklyReports: true,
    systemAnnouncements: true,
    trainingReminders: true,
  });
  
  const [displaySettings, setDisplaySettings] = useState({
    theme: 'light',
    dataDensity: 'compact',
    dashboardLayout: 'grid',
    defaultView: 'incidents',
    autoRefresh: true,
    refreshInterval: 5,
  });
  
  const [emailReportSettings, setEmailReportSettings] = useState({
    receiveWeeklyReport: true,
    receiveMonthlyReport: true,
    includeCharts: true,
    includeDataTables: true,
    reportFormat: 'html',
  });

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleNotificationChange = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    });
  };

  const handleDisplaySettingChange = (setting: keyof typeof displaySettings, value: any) => {
    setDisplaySettings({
      ...displaySettings,
      [setting]: value,
    });
  };

  const handleEmailReportChange = (setting: keyof typeof emailReportSettings) => {
    setEmailReportSettings({
      ...emailReportSettings,
      [setting]: !emailReportSettings[setting],
    });
  };

  const handleSaveProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, this would call an API to save the profile
    alert('Profile settings saved successfully!');
  };

  const handleSaveNotifications = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, this would call an API to save notification settings
    alert('Notification settings saved successfully!');
  };

  const handleSaveDisplay = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, this would call an API to save display settings
    alert('Display settings saved successfully!');
  };

  const handleSaveEmailReports = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, this would call an API to save email report settings
    alert('Email report settings saved successfully!');
  };

  return (
    <DashboardLayout user={user}>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Loading settings...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Page header */}
          <div className="sm:flex sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          </div>

          {/* Settings navigation and content */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Tabs sidebar */}
              <div className="w-full md:w-64 bg-gray-50 p-4 border-b md:border-b-0 md:border-r border-gray-200">
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'profile'
                        ? 'bg-primary-100 text-primary-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FiUser className="mr-3 h-5 w-5 text-gray-500" />
                    Profile Settings
                  </button>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'notifications'
                        ? 'bg-primary-100 text-primary-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FiBell className="mr-3 h-5 w-5 text-gray-500" />
                    Notification Preferences
                  </button>
                  <button
                    onClick={() => setActiveTab('display')}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'display'
                        ? 'bg-primary-100 text-primary-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FiMonitor className="mr-3 h-5 w-5 text-gray-500" />
                    Display Options
                  </button>
                  <button
                    onClick={() => setActiveTab('email')}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'email'
                        ? 'bg-primary-100 text-primary-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FiMail className="mr-3 h-5 w-5 text-gray-500" />
                    Email Reports
                  </button>
                </nav>
              </div>

              {/* Content area */}
              <div className="flex-1 p-6">
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Settings</h2>
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            defaultValue={user.name}
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            defaultValue={user.email}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                          Department
                        </label>
                        <input
                          type="text"
                          name="department"
                          id="department"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          defaultValue={user.department}
                          disabled
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          Department can only be changed by an administrator.
                        </p>
                      </div>

                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                          Role
                        </label>
                        <input
                          type="text"
                          name="role"
                          id="role"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          defaultValue={user.role}
                          disabled
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          Role can only be changed by an administrator.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Profile Image
                        </label>
                        <div className="mt-2 flex items-center space-x-4">
                          <div className="h-16 w-16 rounded-full bg-primary-500 flex items-center justify-center text-white text-2xl">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <button
                            type="button"
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            Change
                          </button>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-md font-medium text-gray-900 mb-3">Change Password</h3>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                              Current Password
                            </label>
                            <input
                              type="password"
                              name="currentPassword"
                              id="currentPassword"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                          </div>
                          <div className="sm:col-span-2 grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                New Password
                              </label>
                              <input
                                type="password"
                                name="newPassword"
                                id="newPassword"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              />
                            </div>
                            <div>
                              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm New Password
                              </label>
                              <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          <FiSave className="-ml-1 mr-2 h-5 w-5" />
                          Save Profile
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h2>
                    <form onSubmit={handleSaveNotifications} className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-md font-medium text-gray-900">Email Notifications</h3>
                            <p className="text-sm text-gray-500">Receive notifications via email</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleNotificationChange('emailNotifications')}
                            className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            style={{ backgroundColor: notificationSettings.emailNotifications ? '#10B981' : '#E5E7EB' }}
                          >
                            <span className="sr-only">Toggle email notifications</span>
                            <span 
                              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                                notificationSettings.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-md font-medium text-gray-900">Incident Alerts</h3>
                            <p className="text-sm text-gray-500">Receive alerts for new incidents</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleNotificationChange('incidentAlerts')}
                            className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            style={{ backgroundColor: notificationSettings.incidentAlerts ? '#10B981' : '#E5E7EB' }}
                          >
                            <span className="sr-only">Toggle incident alerts</span>
                            <span 
                              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                                notificationSettings.incidentAlerts ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-md font-medium text-gray-900">Weekly Reports</h3>
                            <p className="text-sm text-gray-500">Receive weekly summary reports</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleNotificationChange('weeklyReports')}
                            className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            style={{ backgroundColor: notificationSettings.weeklyReports ? '#10B981' : '#E5E7EB' }}
                          >
                            <span className="sr-only">Toggle weekly reports</span>
                            <span 
                              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                                notificationSettings.weeklyReports ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-md font-medium text-gray-900">System Announcements</h3>
                            <p className="text-sm text-gray-500">Receive system updates and announcements</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleNotificationChange('systemAnnouncements')}
                            className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            style={{ backgroundColor: notificationSettings.systemAnnouncements ? '#10B981' : '#E5E7EB' }}
                          >
                            <span className="sr-only">Toggle system announcements</span>
                            <span 
                              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                                notificationSettings.systemAnnouncements ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-md font-medium text-gray-900">Training Reminders</h3>
                            <p className="text-sm text-gray-500">Receive reminders about upcoming or expired training</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleNotificationChange('trainingReminders')}
                            className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            style={{ backgroundColor: notificationSettings.trainingReminders ? '#10B981' : '#E5E7EB' }}
                          >
                            <span className="sr-only">Toggle training reminders</span>
                            <span 
                              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                                notificationSettings.trainingReminders ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          <FiSave className="-ml-1 mr-2 h-5 w-5" />
                          Save Notification Settings
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {activeTab === 'display' && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Display Options</h2>
                    <form onSubmit={handleSaveDisplay} className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Theme</label>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center">
                              <input
                                id="theme-light"
                                name="theme"
                                type="radio"
                                checked={displaySettings.theme === 'light'}
                                onChange={() => handleDisplaySettingChange('theme', 'light')}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                              />
                              <label htmlFor="theme-light" className="ml-3 flex items-center">
                                <FiMonitor className="mr-2 h-5 w-5 text-gray-500" />
                                <span className="text-sm text-gray-700">Light Mode</span>
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="theme-dark"
                                name="theme"
                                type="radio"
                                checked={displaySettings.theme === 'dark'}
                                onChange={() => handleDisplaySettingChange('theme', 'dark')}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                              />
                              <label htmlFor="theme-dark" className="ml-3 flex items-center">
                                <FiMonitor className="mr-2 h-5 w-5 text-gray-500" />
                                <span className="text-sm text-gray-700">Dark Mode</span>
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="theme-system"
                                name="theme"
                                type="radio"
                                checked={displaySettings.theme === 'system'}
                                onChange={() => handleDisplaySettingChange('theme', 'system')}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                              />
                              <label htmlFor="theme-system" className="ml-3 flex items-center">
                                <FiMonitor className="mr-2 h-5 w-5 text-gray-500" />
                                <span className="text-sm text-gray-700">System Default</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Data Density</label>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center">
                              <input
                                id="density-compact"
                                name="dataDensity"
                                type="radio"
                                checked={displaySettings.dataDensity === 'compact'}
                                onChange={() => handleDisplaySettingChange('dataDensity', 'compact')}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                              />
                              <label htmlFor="density-compact" className="ml-3 flex items-center">
                                <FiEye className="mr-2 h-5 w-5 text-gray-500" />
                                <span className="text-sm text-gray-700">Compact</span>
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="density-comfortable"
                                name="dataDensity"
                                type="radio"
                                checked={displaySettings.dataDensity === 'comfortable'}
                                onChange={() => handleDisplaySettingChange('dataDensity', 'comfortable')}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                              />
                              <label htmlFor="density-comfortable" className="ml-3 flex items-center">
                                <FiEye className="mr-2 h-5 w-5 text-gray-500" />
                                <span className="text-sm text-gray-700">Comfortable</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Dashboard Layout</label>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center">
                              <input
                                id="layout-grid"
                                name="dashboardLayout"
                                type="radio"
                                checked={displaySettings.dashboardLayout === 'grid'}
                                onChange={() => handleDisplaySettingChange('dashboardLayout', 'grid')}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                              />
                              <label htmlFor="layout-grid" className="ml-3">
                                <span className="text-sm text-gray-700">Grid Layout</span>
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="layout-list"
                                name="dashboardLayout"
                                type="radio"
                                checked={displaySettings.dashboardLayout === 'list'}
                                onChange={() => handleDisplaySettingChange('dashboardLayout', 'list')}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                              />
                              <label htmlFor="layout-list" className="ml-3">
                                <span className="text-sm text-gray-700">List Layout</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="defaultView" className="block text-sm font-medium text-gray-700">
                            Default View
                          </label>
                          <select
                            id="defaultView"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                            value={displaySettings.defaultView}
                            onChange={(e) => handleDisplaySettingChange('defaultView', e.target.value)}
                          >
                            <option value="dashboard">Dashboard</option>
                            <option value="incidents">Incidents</option>
                            <option value="drivers">Drivers</option>
                            <option value="compliance">Compliance</option>
                            <option value="training">Training</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-md font-medium text-gray-900">Auto-Refresh Dashboard</h3>
                            <p className="text-sm text-gray-500">Automatically refresh dashboard data</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleDisplaySettingChange('autoRefresh', !displaySettings.autoRefresh)}
                            className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            style={{ backgroundColor: displaySettings.autoRefresh ? '#10B981' : '#E5E7EB' }}
                          >
                            <span className="sr-only">Toggle auto-refresh</span>
                            <span 
                              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                                displaySettings.autoRefresh ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        {displaySettings.autoRefresh && (
                          <div>
                            <label htmlFor="refreshInterval" className="block text-sm font-medium text-gray-700">
                              Refresh Interval (minutes)
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm max-w-xs">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiClock className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="number"
                                name="refreshInterval"
                                id="refreshInterval"
                                min="1"
                                max="60"
                                className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                value={displaySettings.refreshInterval}
                                onChange={(e) => handleDisplaySettingChange('refreshInterval', parseInt(e.target.value) || 5)}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          <FiSave className="-ml-1 mr-2 h-5 w-5" />
                          Save Display Settings
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {activeTab === 'email' && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Email Report Settings</h2>
                    <form onSubmit={handleSaveEmailReports} className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-md font-medium text-gray-900">Weekly Safety Report</h3>
                            <p className="text-sm text-gray-500">Receive a weekly safety summary report</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleEmailReportChange('receiveWeeklyReport')}
                            className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            style={{ backgroundColor: emailReportSettings.receiveWeeklyReport ? '#10B981' : '#E5E7EB' }}
                          >
                            <span className="sr-only">Toggle weekly report</span>
                            <span 
                              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                                emailReportSettings.receiveWeeklyReport ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-md font-medium text-gray-900">Monthly Summary Report</h3>
                            <p className="text-sm text-gray-500">Receive a monthly comprehensive summary</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleEmailReportChange('receiveMonthlyReport')}
                            className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            style={{ backgroundColor: emailReportSettings.receiveMonthlyReport ? '#10B981' : '#E5E7EB' }}
                          >
                            <span className="sr-only">Toggle monthly report</span>
                            <span 
                              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                                emailReportSettings.receiveMonthlyReport ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <h3 className="text-md font-medium text-gray-900 mb-3">Report Content</h3>
                          
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Include Charts & Visualizations</h4>
                              <p className="text-xs text-gray-500">Include graphical representations in reports</p>
                            </div>
                            <button 
                              type="button"
                              onClick={() => handleEmailReportChange('includeCharts')}
                              className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                              style={{ backgroundColor: emailReportSettings.includeCharts ? '#10B981' : '#E5E7EB' }}
                            >
                              <span className="sr-only">Toggle charts</span>
                              <span 
                                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                                  emailReportSettings.includeCharts ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Include Data Tables</h4>
                              <p className="text-xs text-gray-500">Include detailed data tables in reports</p>
                            </div>
                            <button 
                              type="button"
                              onClick={() => handleEmailReportChange('includeDataTables')}
                              className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                              style={{ backgroundColor: emailReportSettings.includeDataTables ? '#10B981' : '#E5E7EB' }}
                            >
                              <span className="sr-only">Toggle data tables</span>
                              <span 
                                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                                  emailReportSettings.includeDataTables ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="reportFormat" className="block text-sm font-medium text-gray-700">
                            Preferred Format
                          </label>
                          <select
                            id="reportFormat"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                            value={emailReportSettings.reportFormat}
                            onChange={(e) => setEmailReportSettings({...emailReportSettings, reportFormat: e.target.value})}
                          >
                            <option value="html">HTML (in email body)</option>
                            <option value="pdf">PDF Attachment</option>
                            <option value="excel">Excel Spreadsheet</option>
                            <option value="csv">CSV Format</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          <FiSave className="-ml-1 mr-2 h-5 w-5" />
                          Save Email Report Settings
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
