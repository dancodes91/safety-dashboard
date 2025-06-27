'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import { DataSourceProvider } from '@/lib/context/DataSourceContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <DataSourceProvider>
        {children}
      </DataSourceProvider>
    </ThemeProvider>
  );
}