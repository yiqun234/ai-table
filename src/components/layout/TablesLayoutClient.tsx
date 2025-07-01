'use client';

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useState } from "react";

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
    <div className="flex h-screen overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          tableId={tableId} 
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 