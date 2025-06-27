'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiHome, 
  FiAlertTriangle, 
  FiUsers, 
  FiClipboard, 
  FiBookOpen, 
  FiSettings, 
  FiMenu, 
  FiX, 
  FiBell, 
  FiUser,
  FiLogOut
} from 'react-icons/fi';
import { signOut } from 'next-auth/react';

interface NavItem {
  name: string;
  href: string;
  icon: ReactNode;
  badge?: number;
}

interface DashboardLayoutProps {
  children: ReactNode;
  user?: {
    name?: string;
    email?: string;
    image?: string;
  };
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/', icon: <FiHome className="mr-3 h-5 w-5" /> },
    { name: 'Incidents', href: '/incidents', icon: <FiAlertTriangle className="mr-3 h-5 w-5" />, badge: 3 },
    { name: 'Drivers', href: '/drivers', icon: <FiUsers className="mr-3 h-5 w-5" /> },
    { name: 'Compliance', href: '/compliance', icon: <FiClipboard className="mr-3 h-5 w-5" /> },
    { name: 'Training', href: '/training', icon: <FiBookOpen className="mr-3 h-5 w-5" />, badge: 5 },
    { name: 'Settings', href: '/settings', icon: <FiSettings className="mr-3 h-5 w-5" /> },
  ];

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/auth/signin' });
  };

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 flex md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true"></div>
        </div>
      )}

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 flex flex-col z-50 max-w-xs w-full bg-primary-800 transform transition-transform ease-in-out duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:hidden`}>
        <div className="flex items-center justify-between h-16 flex-shrink-0 px-4 bg-primary-900">
          <div className="text-white font-bold text-xl">Safety Dashboard</div>
          <button
            type="button"
            className="text-white hover:text-gray-200 focus:outline-none"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-1 h-0 overflow-y-auto">
          <nav className="px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive(item.href)
                    ? 'bg-primary-900 text-white'
                    : 'text-primary-100 hover:bg-primary-700'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                {item.name}
                {item.badge && (
                  <span className="ml-auto bg-primary-100 text-primary-800 py-0.5 px-2 rounded-full text-xs">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="px-2 pt-4 pb-2 border-t border-primary-700">
            <button
              onClick={handleSignOut}
              className="flex items-center px-2 py-2 text-base font-medium rounded-md text-primary-100 hover:bg-primary-700 w-full"
            >
              <FiLogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-primary-800">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary-900">
              <div className="text-white font-bold text-xl">Safety Dashboard</div>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      isActive(item.href)
                        ? 'bg-primary-900 text-white'
                        : 'text-primary-100 hover:bg-primary-700'
                    }`}
                  >
                    {item.icon}
                    {item.name}
                    {item.badge && (
                      <span className="ml-auto bg-primary-100 text-primary-800 py-0.5 px-2 rounded-full text-xs">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>

              <div className="px-2 pt-4 pb-2 border-t border-primary-700">
                <button
                  onClick={handleSignOut}
                  className="flex items-center px-2 py-2 text-base font-medium rounded-md text-primary-100 hover:bg-primary-700 w-full"
                >
                  <FiLogOut className="mr-3 h-5 w-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top header */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <FiMenu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              {/* Page title could go here */}
            </div>
            
            <div className="ml-4 flex items-center md:ml-6">
              {/* Notifications */}
              <button
                type="button"
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <span className="sr-only">View notifications</span>
                <FiBell className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                    {user?.name || 'User'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}