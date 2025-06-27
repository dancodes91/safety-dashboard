'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type DataSourceContextType = {
  useMockData: boolean;
  toggleDataSource: () => void;
};

const DataSourceContext = createContext<DataSourceContextType | undefined>(undefined);

export function DataSourceProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage if available, otherwise default to true (mock data)
  const [useMockData, setUseMockData] = useState<boolean>(true);

  useEffect(() => {
    // On client side, get the stored preference
    const storedPreference = localStorage.getItem('useMockData');
    if (storedPreference !== null) {
      setUseMockData(storedPreference === 'true');
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