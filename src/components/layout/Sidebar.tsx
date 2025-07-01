'use client';

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Search,
  MessageSquare,
  Table,
  Mic,
  FileText,
  Book,
  ScanText,
  FileSpreadsheet,
  Building,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface SidebarProps {
  isCollapsed: boolean;
}

export function Sidebar({ isCollapsed }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "#", icon: Search, label: "Search" },
    { href: "#", icon: MessageSquare, label: "Chat" },
    { href: "#", icon: Mic, label: "Transcribe" },
    { href: "/tables/legal-contracts", icon: Table, label: "Tables" },
  ]

  const navItemsAfterSeparator = [
    { href: "#", icon: FileText, label: "Documents" },
    { href: "#", icon: Book, label: "Knowledge" },
  ]

  const historyItems = [
    { href: "#", icon: ScanText, label: "Document Analysis" },
    { href: "#", icon: FileSpreadsheet, label: "Text screening" },
  ]

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-background transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className={cn("p-4 flex items-center h-16", isCollapsed ? "justify-center px-2" : "")}>
        <h1 className="text-2xl font-bold">novis</h1>
      </div>
      
      <TooltipProvider delayDuration={0}>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => (
             <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant={pathname.startsWith(item.href) && item.href !== "#" ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", isCollapsed ? "justify-center px-0" : "")}
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span className={cn("ml-3", isCollapsed ? "hidden" : "inline")}>{item.label}</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
            </Tooltip>
          ))}
          
          <div className="py-2">
            <Separator />
          </div>
          
          {navItemsAfterSeparator.map((item) => (
             <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant={pathname.startsWith(item.href) && item.href !== "#" ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", isCollapsed ? "justify-center px-0" : "")}
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span className={cn("ml-3", isCollapsed ? "hidden" : "inline")}>{item.label}</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
            </Tooltip>
          ))}
          
          <div className="py-2">
            <Separator />
          </div>

          <div className={cn(isCollapsed ? "hidden" : "block")}>
            <Accordion type="single" collapsible defaultValue="history" className="w-full">
              <AccordionItem value="history" className="border-none">
                <AccordionTrigger className="text-sm text-muted-foreground font-normal hover:no-underline px-2">
                  History
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  <div className="space-y-1 ml-4">
                    {historyItems.map((item) => (
                      <Button
                        key={item.label}
                        asChild
                        variant="ghost"
                        className="w-full justify-start font-normal text-sm"
                      >
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span className="ml-3">{item.label}</span>
                        </Link>
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </nav>
      </TooltipProvider>

      <div className={cn("p-4 mt-auto", isCollapsed ? "p-2 justify-center flex" : "")}>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
            <Building className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className={cn("flex-1 min-w-0", isCollapsed ? "hidden" : "block")}>
            <p className="text-sm font-medium truncate">Adam Smith</p>
            <p className="text-xs text-muted-foreground truncate">Smith & partners</p>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground",
              isCollapsed ? "hidden" : "block"
            )}
          />
        </div>
      </div>
    </aside>
  );
} 