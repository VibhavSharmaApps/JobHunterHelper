import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Link, 
  FileText, 
  Bot, 
  Settings,
  Briefcase,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const navigationItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "urls", icon: Link, label: "Job URLs" },
  { id: "applications", icon: FileText, label: "Applications" },
  { id: "cv-builder", icon: Bot, label: "AI CV Builder" },
  { id: "settings", icon: Settings, label: "Settings" },
];

export default function Sidebar({ activeTab, onTabChange, isOpen, onToggle }: SidebarProps) {
  const isMobile = useIsMobile();

  if (isMobile && !isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "bg-white border-r border-slate-200 flex flex-col",
        isMobile ? "fixed left-0 top-0 h-full w-64 z-50" : "w-64"
      )}>
        {/* Logo/Brand */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <Briefcase className="text-primary text-xl" />
            <span className="text-xl font-bold text-slate-900">JobFlow</span>
          </div>
          {isMobile && (
            <Button variant="ghost" size="sm" onClick={onToggle}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                if (isMobile) onToggle();
              }}
              className={cn(
                "flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg group transition-colors",
                activeTab === item.id
                  ? "text-primary bg-blue-50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="flex-shrink-0 p-4 border-t border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">JD</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">John Doe</p>
              <p className="text-xs text-slate-500">john@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
