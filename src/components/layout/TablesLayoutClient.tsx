'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface TablesLayoutClientProps {
  children: React.ReactNode;
  tableId: string;
}

export function TablesLayoutClient({ 
  children, 
  tableId 
}: TablesLayoutClientProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar isCollapsed={isCollapsed} />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Header 
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          tableId={tableId}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 