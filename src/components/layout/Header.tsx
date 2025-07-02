import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Separator } from "@/components/ui/separator";
import {
  ChevronRight,
  Share2,
  Clock,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  GitCompare,
  Star
} from "lucide-react";

function formatTableName(slug: string) {
  if (!slug) return "";
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

interface HeaderProps {
  tableId: string;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  onRun: () => void;
}

export function Header({ tableId, isCollapsed, setIsCollapsed, onRun }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b h-16">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </Button>
        <p className="text-sm text-muted-foreground">Home</p>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Tables</p>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm font-medium">{formatTableName(tableId)}</p>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://github.com/vercel.png" alt="@vercel" />
          <AvatarFallback>VC</AvatarFallback>
        </Avatar>
         <Separator orientation="vertical" className="h-6 mx-2" />
        <Button variant="ghost" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Star className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <GitCompare className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Clock className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6 mx-2" />
        <Button variant="outline">Export</Button>
        <Button onClick={onRun} className="bg-blue-500 hover:bg-blue-600 text-white">Run</Button>
      </div>
    </header>
  );
} 