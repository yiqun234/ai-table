import { TablesLayoutClient } from "@/components/layout/TablesLayoutClient";

interface TablesLayoutProps {
  children: React.ReactNode;
  params: Promise<{ tableId: string }>;
}

export default async function TablesLayout({ 
  children, 
  params 
}: TablesLayoutProps) {
  const { tableId } = await params;

  return (
    <TablesLayoutClient tableId={tableId}>
      {children}
    </TablesLayoutClient>
  );
} 