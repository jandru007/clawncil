'use client';

import { TabType } from './Dashboard';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  agentCount: number;
}

const menuItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
  {
    id: 'agents',
    label: 'Agents',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 8V4H8"/>
        <rect width="16" height="12" x="4" y="8" rx="2"/>
        <path d="M2 14h2"/>
        <path d="M20 14h2"/>
        <path d="M15 13v2"/>
        <path d="M9 13v2"/>
      </svg>
    ),
  },
  {
    id: 'tasks',
    label: 'Tasks',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect width="7" height="9" x="3" y="3" rx="1"/>
        <rect width="7" height="5" x="14" y="3" rx="1"/>
        <rect width="7" height="9" x="14" y="12" rx="1"/>
        <rect width="7" height="5" x="3" y="16" rx="1"/>
      </svg>
    ),
  },
  {
    id: 'meeting',
    label: 'Meeting',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 3v18h18"/>
        <path d="M18 17V9"/>
        <path d="M13 17V5"/>
        <path d="M8 17v-3"/>
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  },
];

export function Sidebar({ activeTab, onTabChange, collapsed, onToggleCollapse, agentCount }: SidebarProps) {
  return (
    <aside className={cn(
      "sidebar glass border-r border-white/10 flex flex-col shrink-0 z-50 transition-all duration-300",
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-white/10">
        <button 
          onClick={onToggleCollapse}
          className="shrink-0 w-8 h-8 bg-blue-500/20 flex items-center justify-center text-blue-400 hover:bg-orange-500/30 transition-colors pulse-glow"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" x2="20" y1="12" y2="12"/>
            <line x1="4" x2="20" y1="6" y2="6"/>
            <line x1="4" x2="20" y1="18" y2="18"/>
          </svg>
        </button>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-white">Clawncil</span>
            <span className="text-xs text-zinc-500 px-1.5 py-0.5 bg-zinc-800">Beta</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "sidebar-menu-item w-full flex items-center gap-3 px-3 py-2.5 border transition-all",
              activeTab === item.id
                ? "bg-orange-500/10 text-orange-400 border-orange-500/30"
                : "text-zinc-500 border-transparent hover:text-zinc-300"
            )}
          >
            <span className="shrink-0">{item.icon}</span>
            {!collapsed && (
              <>
                <span className="font-medium text-sm whitespace-normal flex-1 text-left">{item.label}</span>
                {item.id === 'tasks' && (
                  <span className="text-xs bg-zinc-800 px-2 py-0.5">0</span>
                )}
                {item.id === 'meeting' && (
                  <span className="w-2 h-2 bg-blue-400 animate-pulse"></span>
                )}
              </>
            )}
          </button>
        ))}
      </nav>

      {/* System Status */}
      <div className="p-3 border-t border-white/10">
        {!collapsed && (
          <div className="glass p-3 border border-white/5 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-600 uppercase font-bold font-inter">System</span>
              <div className="w-1.5 h-1.5 bg-emerald-500 animate-pulse"></div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Active</span>
                <span className="text-orange-400 mono">{agentCount}</span>
              </div>
              <div className="h-1 bg-zinc-900 overflow-hidden">
                <div className="h-full fire-gradient w-2/3"></div>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-center">
          <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 flex items-center justify-center">
            <span className="text-sm font-medium text-zinc-400">J</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
