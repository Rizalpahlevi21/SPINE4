import React from 'react';
import { LayoutDashboard, Table as TableIcon, Upload, LogOut, FileSpreadsheet, BarChart3, ShieldCheck, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'data', label: 'Data Editor', icon: TableIcon },
    { id: 'upload', label: 'Upload Data', icon: Upload },
  ];

  return (
    <div className="w-64 bg-blue-900 text-white h-screen flex flex-col fixed left-0 top-0 shadow-2xl z-50">
      <div className="p-6 flex items-center gap-3 border-b border-blue-800">
        <div className="bg-white p-1.5 rounded-lg">
          <BarChart3 className="text-blue-900 w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">DataViz Pro</h1>
      </div>

      <div className="flex-1 py-6 px-4 space-y-2">
        <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider px-2 mb-4">Main Menu</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              activeTab === item.id 
                ? "bg-white text-blue-900 shadow-lg" 
                : "text-blue-100 hover:bg-blue-800"
            )}
          >
            <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-blue-900" : "text-blue-300 group-hover:text-white")} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-blue-800">
        <div className="bg-blue-800/50 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <span className="text-xs font-medium text-blue-200">Secure Session</span>
          </div>
          <p className="text-[10px] text-blue-300 leading-relaxed">
            Your data is processed locally in your browser for maximum privacy.
          </p>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-900/30 hover:text-red-200 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
