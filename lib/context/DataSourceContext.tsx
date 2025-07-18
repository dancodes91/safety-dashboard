'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type DataSourceContextType = {
  useMockData: boolean;
  toggleDataSource: () => void;
};

const DataSourceContext = createContext<DataSourceContextType | undefined>(undefined);

export function DataSourceProvider({ children }: { children: ReactNode }) {
  // Initialize state from environment variable, then localStorage, otherwise default to true (mock data)
  const [useMockData, setUseMockData] = useState<boolean>(() => {
    // Check environment variable first
    if (typeof window === 'undefined') {
      return process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
    }
    return true; // Default for client-side initial render
  });

  useEffect(() => {
    // On client side, get the stored preference or use environment variable
    const storedPreference = localStorage.getItem('useMockData');
    if (storedPreference !== null) {
      setUseMockData(storedPreference === 'true');
    } else {
      // Use environment variable as default
      const envDefault = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
      setUseMockData(envDefault);
    }
  }, []);

  // Update localStorage when preference changes
  useEffect(() => {
    localStorage.setItem('useMockData', String(useMockData));
  }, [useMockData]);

  const toggleDataSource = () => {
    setUseMockData(prev => !prev);
  };

  return (
    <DataSourceContext.Provider value={{ useMockData, toggleDataSource }}>
      {children}
    </DataSourceContext.Provider>
  );
}

export function useDataSource() {
  const context = useContext(DataSourceContext);
  if (context === undefined) {
    throw new Error('useDataSource must be used within a DataSourceProvider');
  }
  return context;
}
