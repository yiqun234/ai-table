'use client';

import { useState, useRef, ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { EditableTable, EditableTableRef } from '../table/EditableTable';

interface TablesLayoutClientProps {
  tableId: string;
  children: ReactNode; // children will be ignored for now to fix the run button
}

export function TablesLayoutClient({ tableId }: TablesLayoutClientProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const editableTableRef = useRef<EditableTableRef>(null);

  const handleRun = () => {
    editableTableRef.current?.runAll();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar isCollapsed={isCollapsed} />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Header 
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          tableId={tableId}
          onRun={handleRun}
        />
        <main className="flex-1 overflow-y-auto">
          <EditableTable ref={editableTableRef} />
        </main>
      </div>
    </div>
  );
} 