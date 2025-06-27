'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  FiServer, 
  FiShield, 
  FiMail, 
  FiSave, 
  FiDatabase, 
  FiGlobe, 
  FiSettings,
  FiClock,
  FiBell,
  FiRefreshCw,
  FiKey,
  FiLock
} from 'react-icons/fi';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: 'Admin User', email: 'admin@example.com' });
  const [activeTab, setActiveTab] = useState('general');

  // Simulated system settings data
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'Safety First Inc.',
    primaryContactEmail: 'admin@safetyfirst.com',
    primaryContactPhone: '(555) 123-4567',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    defaultLanguage: 'en-US',
    maintenanceMode: false,
    scheduledMaintenance: '',
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpServer: 'smtp.safetyfirst.com',
    smtpPort: '587',
    smtpUsername: 'notifications@safetyfirst.com',
    smtpPassword: '••••••••••••',
    fromAddress: 'notifications@safetyfirst.com',
    fromName: 'Safety Dashboard',
    enableSSL: true,
    testEmailRecipient: '',
  });

  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecialChars: true,
    passwordExpiryDays: 90,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    enforceMultiFactorAuth: false,
    allowedIpRanges: '',
    apiKeyExpiration: 365,
  });

  const [dataSettings, setDataSettings] = useState({
    incidentDataRetention: 730, // days
    driverDataRetention: 365, // days
    auditLogRetention: 90, // days
    automaticBackup: true,
    backupFrequency: 'daily',
    backupRetention: 30, // days
    storageLocation: 'local',
    compressionEnabled: true,
    autoArchive: true,
    archiveThreshold: 365, // days
  });

  const [notificationSettings, setNotificationSettings] = useState({
    weeklyReportDay: 'Monday',
    weeklyReportTime: '08:00',
    monthlyReportDay: 1,
    monthlyReportTime: '08:00',
    reminderLeadTime: 7, // days
    criticalAlertEmails: 'admin@safetyfirst.com,safety@safetyfirst.com',
    alertThreshold: 'medium',
    digestFrequency: 'daily',
  });

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    // In a real app, this would call an API
    alert('General settings saved successfully!');
  };

  const handleSaveEmail = (e) => {
    e.preventDefault();
    // In a real app, this would call an API
    alert('Email settings saved successfully!');
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    // In a real app, this would call an API
    alert('Security settings saved successfully!');
  };

  const handleSaveData = (e) => {
    e.preventDefault();
    // In a real app, this would call an API
    alert('Data retention settings saved successfully!');
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    // In a real app, this would call an API
    alert('System notification settings saved successfully!');
  };

  const handleTestEmail = (e) => {
    e.preventDefault();
    // In a real app, this would call an API to send a test email
    alert('Test email sent successfully!');
  };

  const handleMaintenanceModeToggle = () => {
    setGeneralSettings({
      ...generalSettings,
      maintenanceMode: !generalSettings.maintenanceMode
    });
  };

  return (
    <DashboardLayout user={user}>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Loading system settings...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Page header */}
          <div className="sm:flex sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">System Settings</h1>
          </div>

          {/* Admin system status indicators */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                    <FiServer className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">System Status</dt>
                      <dd>
                        <div className="text-lg font-medium text-success-600">Operational</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <FiDatabase className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Database</dt>
                      <dd>
                        <div className="text-lg font-medium text-success-600">Connected</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                    <FiMail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Email Service</dt>
                      <dd>
                        <div className="text-lg font-medium text-success-600">Active</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                    <FiShield className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Security</dt>
                      <dd>
                        <div className="text-lg font-medium text-success-600">Secure</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings navigation and content */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Tabs sidebar */}
              <div className="w-full md:w-64 bg-gray-50 p-4 border-b md:border-b-0 md:border-r border-gray-200">
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab('general')}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'general'
                        ? 'bg-primary-100 text-primary-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FiSettings className="mr-3 h-5 w-5 text-gray-500" />
                    General Settings
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
                    Email Configuration
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'security'
                        ? 'bg-primary-100 text-primary-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FiShield className="mr-3 h-5 w-5 text-gray-500" />
                    Security Settings
                  </button>
                  <button
                    onClick={() => setActiveTab('data')}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'data'
                        ? 'bg-primary-100 text-primary-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FiDatabase className="mr-3 h-5 w-5 text-gray-500" />
                    Data Retention
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
                    System Notifications
                  </button>
                </nav>
              </div>

              {/* Content area */}
              <div className="flex-1 p-6">
                {activeTab === 'general' && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">General System Settings</h2>
                    <form onSubmit={handleSaveGeneral} className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                            Company Name
                          </label>
                          <input
                            type="text"
                            name="companyName"
                            id="companyName"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            value={generalSettings.companyName}
                            onChange={(e) => setGeneralSettings({...generalSettings, companyName: e.target.value})}
                          />
                        </div>
                        <div>
                          <label htmlFor="primaryContactEmail" className="block text-sm font-medium text-gray-700">
                            Primary Contact Email
                          </label>
                          <input
                            type="email"
                            name="primaryContactEmail"
                            id="primaryContactEmail"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            value={generalSettings.primaryContactEmail}
                            onChange={(e) => setGeneralSettings({...generalSettings, primaryContactEmail: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label htmlFor="primaryContactPhone" className="block text-sm font-medium text-gray-700">
                            Primary Contact Phone
                          </label>
                          <input
                            type="text"
                            name="primaryContactPhone"
                            id="primaryContactPhone"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            value={generalSettings.primaryContactPhone}
                            onChange={(e) => setGeneralSettings({...generalSettings, primaryContactPhone: e.target.value})}
                          />
                        </div>
                        <div>
                          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                            System Timezone
                          </label>
                          <select
                            id="timezone"
                            name="timezone"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                            value={generalSettings.timezone}
                            onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                          >
                            <option value="America/New_York">Eastern Time (ET) - America/New_York</option>
                            <option value="America/Chicago">Central Time (CT) - America/Chicago</option>
                            <option value="America/Denver">Mountain Time (MT) - America/Denver</option>
                            <option value="America/Los_Angeles">Pacific Time (PT) - America/Los_Angeles</option>
                            <option value="America/Anchorage">Alaska Time - America/Anchorage</option>
                            <option value="America/Honolulu">Hawaii Time - America/Honolulu</option>
                            <option value="Europe/London">Greenwich Mean Time (GMT) - Europe/London</option>
                            <option value="Europe/Paris">Central European Time (CET) - Europe/Paris</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        <div>
                          <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700">
                            Date Format
                          </label>
                          <select
                            id="dateFormat"
                            name="dateFormat"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                            value={generalSettings.dateFormat}
                            onChange={(e) => setGeneralSettings({...generalSettings, dateFormat: e.target.value})}
                          >
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="timeFormat" className="block text-sm font-medium text-gray-700">
                            Time Format
                          </label>
                          <select
                            id="timeFormat"
                            name="timeFormat"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                            value={generalSettings.timeFormat}
                            onChange={(e) => setGeneralSettings({...generalSettings, timeFormat: e.target.value})}
                          >
                            <option value="12h">12-hour (AM/PM)</option>
                            <option value="24h">24-hour</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="defaultLanguage" className="block text-sm font-medium text-gray-700">
                            Default Language
                          </label>
                          <select
                            id="defaultLanguage"
                            name="defaultLanguage"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                            value={generalSettings.defaultLanguage}
                            onChange={(e) => setGeneralSettings({...generalSettings, defaultLanguage: e.target.value})}
                          >
                            <option value="en-US">English (US)</option>
                            <option value="en-GB">English (UK)</option>
                            <option value="es-ES">Spanish</option>
                            <option value="fr-FR">French</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-md font-medium text-gray-900 mb-3">Maintenance Settings</h3>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Maintenance Mode</h4>
                            <p className="text-xs text-gray-500">Put system in maintenance mode (users will see a maintenance page)</p>
                          </div>
                          <button 
                            type="button"
                            onClick={handleMaintenanceModeToggle}
                            className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            style={{ backgroundColor: generalSettings.maintenanceMode ? '#EF4444' : '#E5E7EB' }}
                          >
                            <span className="sr-only">Toggle maintenance mode</span>
                            <span 
                              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                                generalSettings.maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        {generalSettings.maintenanceMode && (
                          <div>
                            <label htmlFor="scheduledMaintenance" className="block text-sm font-medium text-gray-700">
                              Scheduled End Time (leave blank for indefinite)
                            </label>
                            <input
                              type="datetime-local"
                              name="scheduledMaintenance"
                              id="scheduledMaintenance"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              value={generalSettings.scheduledMaintenance}
                              onChange={(e) => setGeneralSettings({...generalSettings, scheduledMaintenance: e.target.value})}
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          <FiSave className="-ml-1 mr-2 h-5 w-5" />
                          Save General Settings
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {activeTab === 'email' && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Email Server Configuration</h2>
                    <form onSubmit={handleSaveEmail} className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label htmlFor="smtpServer" className="block text-sm font-medium text-gray-700">
                            SMTP Server
                          </label>
                          <input
                            type="text"
                            name="smtpServer"
                            id="smtpServer"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            value={emailSettings.smtpServer}
                            onChange={(e) => setEmailSettings({...emailSettings, smtpServer: e.target.value})}
                          />
                        </div>
                        <div>
                          <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700">
                            SMTP Port
                          </label>
                          <input
                            type="text"
                            name="smtpPort"
                            id="smtpPort"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            value={emailSettings.smtpPort}
                            onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label htmlFor="smtpUsername" className="block text-sm font-medium text-gray-700">
                            SMTP Username
                          </label>
                          <input
                            type="text"
                            name="smtpUsername"
                            id="smtpUsername"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            value={emailSettings.smtpUsername}
                            onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                          />
                        </div>
                        <div>
                          <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700">
                            SMTP Password
                          </label>
                          <input
                            type="password"
                            name="smtpPassword"
                            id="smtpPassword"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            value={emailSettings.smtpPassword}
                            onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label htmlFor="fromAddress" className="block text-sm font-medium text-gray-700">
                            From Email Address
                          </label>
                          <input
                            type="email"
                            name="fromAddress"
                            id="fromAddress"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            value={emailSettings.fromAddress}
                            onChange={(e) => setEmailSettings({...emailSettings, fromAddress: e.target.value})}
                          />
                        </div>
                        <div>
                          <label htmlFor="fromName" className="block text-sm font-medium text-gray-700">
                            From Name
                          </label>
                          <input
                            type="text"
                            name="fromName"
                            id="fromName"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            value={emailSettings.fromName}
                            onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="enableSSL"
                          name="enableSSL"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          checked={emailSettings.enableSSL}
                          onChange={(e) => setEmailSettings({...emailSettings, enableSSL: e.target.checked})}
                        />
                        <label htmlFor="enableSSL" className="ml-2 block text-sm text-gray-900">
                          Enable SSL/TLS
                        </label>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-md font-medium text-gray-900 mb-3">Test Email Configuration</h3>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <div>
                            <label htmlFor="testEmailRecipient" className="block text-sm font-medium text-gray-700">
                              Test Email Recipient
                            </label>
                            <input
                              type="email"
                              name="testEmailRecipient"
                              id="testEmailRecipient"
                              placeholder="Enter email address"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              value={emailSettings.testEmailRecipient}
                              onChange={(e) => setEmailSettings({...emailSettings, testEmailRecipient: e.target.value})}
                            />
                          </div>
                          <div className="flex items-end">
                            <button
                              type="button"
                              onClick={handleTestEmail}
                              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                              <FiMail className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                              Send Test Email
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          <FiSave className="-ml-1 mr-2 h-5 w-5" />
                          Save Email Settings
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h2>
                    <form onSubmit={handleSaveSecurity} className="space-y-6">
                      <div className="pt-2">
                        <h3 className="text-md font-medium text-gray-900 mb-3">Password Policy</h3>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <div>
                            <label htmlFor="passwordMinLength" className="block text-sm font-medium text-gray-700">
                              Minimum Password Length
                            </label>
                            <input
                              type="number"
                              name="passwordMinLength"
                              id="passwordMinLength"
                              min="6"
                              max="32"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              value={securitySettings.passwordMinLength}
                              onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                            />
                          </div>
                          <div>
                            <label htmlFor="passwordExpiryDays" className="block text-sm font-medium text-gray-700">
                              Password Expiry (days)
                            </label>
                            <input
                              type="number"
                              name="passwordExpiryDays"
                              id="passwordExpiryDays"
                              min="0"
                              max="365"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              value={securitySettings.passwordExpiryDays}
                              onChange={(e) => setSecuritySettings({...securitySettings, passwordExpiryDays: parseInt(e.target.value)})}
                            />
                            <p className="mt-1 text-xs text-gray-500">Set to 0 for no expiration</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center">
                            <input
                              id="passwordRequireUppercase"
                              name="passwordRequireUppercase"
                              type="checkbox"
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              checked={securitySettings.passwordRequireUppercase}
                              onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireUppercase: e.target.checked})}
                            />
                            <label htmlFor="passwordRequireUppercase" className="ml-2 block text-sm text-gray-900">
                              Require uppercase letters
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="passwordRequireLowercase"
                              name="passwordRequireLowercase"
                              type="checkbox"
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              checked={securitySettings.passwordRequireLowercase}
                              onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireLowercase: e.target.checked})}
                            />
                            <label htmlFor="passwordRequireLowercase" className="ml-2 block text-sm text-gray-900">
                              Require lowercase letters
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="passwordRequireNumbers"
                              name="passwordRequireNumbers"
                              type="checkbox"
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              checked={securitySettings.passwordRequireNumbers}
                              onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireNumbers: e.target.checked})}
                            />
                            <label htmlFor="passwordRequireNumbers" className="ml-2 block text-sm text-gray-900">
                              Require numbers
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="passwordRequireSpecialChars"
                              name="passwordRequireSpecialChars"
                              type="checkbox"
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              checked={securitySettings.passwordRequireSpecialChars}
                              onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireSpecialChars: e.target.checked})}
                            />
                            <label htmlFor="passwordRequireSpecialChars" className="ml-2 block text-sm text-gray-900">
                              Require special characters
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-md font-medium text-gray-900 mb-3">Authentication</h3>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <div>
                            <label htmlFor="maxLoginAttempts" className="block text-sm font-medium text-gray-700">
                              Max Failed Login Attempts
                            </label>
                            <input
                              type="number"
                              name="maxLoginAttempts"
                              id="maxLoginAttempts"
                              min="1"
                              max="10"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              value={securitySettings.maxLoginAttempts}
                              onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                            />
                          </div>
                          <div>
                            <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700">
                              Session Timeout (minutes)
                            </label>
                            <input
                              type="number"
                              name="sessionTimeout"
                              id="sessionTimeout"
                              min="5"
                              max="480"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              value={securitySettings.sessionTimeout}
                              onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4 flex items-center">
                          <input
                            id="enforceMultiFactorAuth"
                            name="enforceMultiFactorAuth"
                            type="checkbox"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            checked={securitySettings.enforceMultiFactorAuth}
                            onChange={(e) => setSecuritySettings({...securitySettings, enforceMultiFactorAuth: e.target.checked})}
                          />
                          <label htmlFor="enforceMultiFactorAuth" className="ml-2 block text-sm text-gray-900">
                            Enforce Multi-Factor Authentication for all users
                          </label>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-md font-medium text-gray-900 mb-3">API Security</h3>
                        <div>
                          <label htmlFor="apiKeyExpiration" className="block text-sm font-medium text-gray-700">
                            API Key Expiration (days)
                          </label>
                          <input
                            type="number"
                            name="apiKeyExpiration"
                            id="apiKeyExpiration"
                            min="1"
                            max="3650"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            value={securitySettings.apiKeyExpiration}
                            onChange={(e) => setSecuritySettings({...securitySettings, apiKeyExpiration: parseInt(e.target.value)})}
                          />
                        </div>
                        
                        <div className="mt-4">
                          <label htmlFor="allowedIpRanges" className="block text-sm font-medium text-gray-700">
                            Allowed IP Ranges (one per line, leave blank to allow all)
                          </label>
                          <textarea
                            id="allowedIpRanges"
                            name="allowedIpRanges"
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            placeholder="192.168.1.0/24
10.0.0.0/8"
                            value={securitySettings.allowedIpRanges}
                            onChange={(e) => setSecuritySettings({...securitySettings, allowedIpRanges: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          <FiSave className="-ml-1 mr-2 h-5 w-5" />
                          Save Security Settings
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {activeTab === 'data' && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Data Retention Policies</h2>
                    <form onSubmit={handleSaveData} className="space-y-6">
                      <div className="pt-2">
                        <h3 className="text-md font-medium text-gray-900 mb-3">Retention Periods</h3>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                          <div>
                            <label htmlFor="incidentDataRetention" className="block text-sm font-medium text-gray-700">
                              Incident Data (days)
                            </label>
                            <input
                              type="number"
                              name="incidentDataRetention"
                              id="incidentDataRetention"
                              min="30"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              value={dataSettings.incidentDataRetention}
                              onChange={(e) => setDataSettings({...dataSettings, incidentDataRetention: parseInt(e.target.value)})}
                            />
                          </div>
                          <div>
                            <label htmlFor="driverDataRetention" className="block text-sm font-medium text-gray-700">
                              Driver Data (days)
                            </label>
                            <input
                              type="number"
                              name="driverDataRetention"
                              id="driverDataRetention"
                              min="30"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              value={dataSettings.driverDataRetention}
                              onChange={(e) => setDataSettings({...dataSettings, driverDataRetention: parseInt(e.target.value)})}
                            />
                          </div>
                          <div>
                            <label htmlFor="auditLogRetention" className="block text-sm font-medium text-gray-700">
                              Audit Logs (days)
                            </label>
                            <input
                              type="number"
                              name="auditLogRetention"
                              id="auditLogRetention"
                              min="30"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              value={dataSettings.auditLogRetention}
                              onChange={(e) => setDataSettings({...dataSettings, auditLogRetention: parseInt(e.target.value)})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-md font-medium text-gray-900 mb-3">Backup Configuration</h3>
                        
                        <div className="flex items-center mb-4">
                          <input
                            id="automaticBackup"
                            name="automaticBackup"
                            type="checkbox"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            checked={dataSettings.automaticBackup}
                            onChange={(e) => setDataSettings({...dataSettings, automaticBackup: e.target.checked})}
                          />
                          <label htmlFor="automaticBackup" className="ml-2 block text-sm text-gray-900">
                            Enable automatic backups
                          </label>
                        </div>
                        
                        {dataSettings.automaticBackup && (
                          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                            <div>
                              <label htmlFor="backupFrequency" className="block text-sm font-medium text-gray-700">
                                Backup Frequency
                              </label>
                              <select
                                id="backupFrequency"
                                name="backupFrequency"
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                                value={dataSettings.backupFrequency}
                                onChange={(e) => setDataSettings({...dataSettings, backupFrequency: e.target.value})}
                              >
                                <option value="hourly">Hourly</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                              </select>
                            </div>
                            <div>
                              <label htmlFor="backupRetention" className="block text-sm font-medium text-gray-700">
                                Backup Retention (days)
                              </label>
                              <input
                                type="number"
                                name="backupRetention"
                                id="backupRetention"
                                min="1"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                value={dataSettings.backupRetention}
                                onChange={(e) => setDataSettings({...dataSettings, backupRetention: parseInt(e.target.value)})}
                              />
                            </div>
                            <div>
                              <label htmlFor="storageLocation" className="block text-sm font-medium text-gray-700">
                                Storage Location
                              </label>
                              <select
                                id="storageLocation"
                                name="storageLocation"
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                                value={dataSettings.storageLocation}
                                onChange={(e) => setDataSettings({...dataSettings, storageLocation: e.target.value})}
                              >
                                <option value="local">Local Storage</option>
                                <option value="s3">Amazon S3</option>
                                <option value="azure">Azure Blob Storage</option>
                                <option value="gcs">Google Cloud Storage</option>
                              </select>
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-4 flex items-center">
                          <input
                            id="compressionEnabled"
                            name="compressionEnabled"
                            type="checkbox"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            checked={dataSettings.compressionEnabled}
                            onChange={(e) => setDataSettings({...dataSettings, compressionEnabled: e.target.checked})}
                          />
                          <label htmlFor="compressionEnabled" className="ml-2 block text-sm text-gray-900">
                            Enable backup compression
                          </label>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-md font-medium text-gray-900 mb-3">Archiving</h3>
                        
                        <div className="flex items-center mb-4">
                          <input
                            id="autoArchive"
                            name="autoArchive"
                            type="checkbox"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            checked={dataSettings.autoArchive}
                            onChange={(e) => setDataSettings({...dataSettings, autoArchive: e.target.checked})}
                          />
                          <label htmlFor="autoArchive" className="ml-2 block text-sm text-gray-900">
                            Enable automatic archiving of old data
                          </label>
                        </div>
                        
                        {dataSettings.autoArchive && (
                          <div>
                            <label htmlFor="archiveThreshold" className="block text-sm font-medium text-gray-700">
                              Archive data older than (days)
                            </label>
                            <input
                              type="number"
                              name="archiveThreshold"
                              id="archiveThreshold"
                              min="30"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              value={dataSettings.archiveThreshold}
                              onChange={(e) => setDataSettings({...dataSettings, archiveThreshold: parseInt(e.target.value)})}
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          <FiSave className="-ml-1 mr-2 h-5 w-5" />
                          Save Data Retention Settings
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">System Notification Settings</h2>
                    <form onSubmit={handleSaveNotifications} className="space-y-6">
                      <div className="pt-2">
                        <h3 className="text-md font-medium text-gray-900 mb-3">Scheduled Reports</h3>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <div>
                            <label htmlFor="weeklyReportDay" className="block text-sm font-medium text-gray-700">
                              Weekly Report Day
                            </label>
                            <select
                              id="weeklyReportDay"
                              name="weeklyReportDay"
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                              value={notificationSettings.weeklyReportDay}
                              onChange={(e) => setNotificationSettings({...notificationSettings, weeklyReportDay: e.target.value})}
                            >
                              <option value="Monday">Monday</option>
                              <option value="Tuesday">Tuesday</option>
                              <option value="Wednesday">Wednesday</option>
                              <option value="Thursday">Thursday</option>
                              <option value="Friday">Friday</option>
                              <option value="Saturday">Saturday</option>
                              <option value="Sunday">Sunday</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="weeklyReportTime" className="block text-sm font-medium text-gray-700">
                              Weekly Report Time
                            </label>
                            <input
                              type="time"
                              name="weeklyReportTime"
                              id="weeklyReportTime"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              value={notificationSettings.weeklyReportTime}
                              onChange={(e) => setNotificationSettings({...notificationSettings, weeklyReportTime: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-4">
                          <div>
                            <label htmlFor="monthlyReportDay" className="block text-sm font-medium text-gray-700">
                              Monthly Report Day (of month)
                            </label>
                            <select
                              id="monthlyReportDay"
                              name="monthlyReportDay"
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                              value={notificationSettings.monthlyReportDay}
                              onChange={(e) => setNotificationSettings({...notificationSettings, monthlyReportDay: parseInt(e.target.value)})}
                            >
                              {[...Array(28)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                              ))}
                              <option value={0}>Last day of month</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="monthlyReportTime" className="block text-sm font-medium text-gray-700">
                              Monthly Report Time
                            </label>
                            <input
                              type="time"
                              name="monthlyReportTime"
                              id="monthlyReportTime"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              value={notificationSettings.monthlyReportTime}
                              onChange={(e) => setNotificationSettings({...notificationSettings, monthlyReportTime: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-md font-medium text-gray-900 mb-3">Alert Configuration</h3>
                        <div>
                          <label htmlFor="reminderLeadTime" className="block text-sm font-medium text-gray-700">
                            Training/Certification Reminder Lead Time (days)
                          </label>
                          <input
                            type="number"
                            name="reminderLeadTime"
                            id="reminderLeadTime"
                            min="1"
                            max="90"
                            className="mt-1 block w-full sm:max-w-xs border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            value={notificationSettings.reminderLeadTime}
                            onChange={(e) => setNotificationSettings({...notificationSettings, reminderLeadTime: parseInt(e.target.value)})}
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Days before expiration to send reminder notifications
                          </p>
                        </div>
                        
                        <div className="mt-4">
                          <label htmlFor="criticalAlertEmails" className="block text-sm font-medium text-gray-700">
                            Critical Alert Recipients (comma-separated emails)
                          </label>
                          <input
                            type="text"
                            name="criticalAlertEmails"
                            id="criticalAlertEmails"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            value={notificationSettings.criticalAlertEmails}
                            onChange={(e) => setNotificationSettings({...notificationSettings, criticalAlertEmails: e.target.value})}
                          />
                        </div>
                        
                        <div className="mt-4">
                          <label htmlFor="alertThreshold" className="block text-sm font-medium text-gray-700">
                            Alert Threshold
                          </label>
                          <select
                            id="alertThreshold"
                            name="alertThreshold"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                            value={notificationSettings.alertThreshold}
                            onChange={(e) => setNotificationSettings({...notificationSettings, alertThreshold: e.target.value})}
                          >
                            <option value="low">Low (All alerts)</option>
                            <option value="medium">Medium (Moderate and high severity)</option>
                            <option value="high">High (High severity only)</option>
                          </select>
                        </div>
                        
                        <div className="mt-4">
                          <label htmlFor="digestFrequency" className="block text-sm font-medium text-gray-700">
                            Alert Digest Frequency
                          </label>
                          <select
                            id="digestFrequency"
                            name="digestFrequency"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                            value={notificationSettings.digestFrequency}
                            onChange={(e) => setNotificationSettings({...notificationSettings, digestFrequency: e.target.value})}
                          >
                            <option value="realtime">Real-time (immediate)</option>
                            <option value="hourly">Hourly digest</option>
                            <option value="daily">Daily digest</option>
                            <option value="weekly">Weekly digest</option>
                          </select>
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
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}