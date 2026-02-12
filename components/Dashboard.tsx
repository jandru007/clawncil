'use client';

import { useState, useEffect } from 'react';
import { NeuralBackground } from '@/components/NeuralBackground';
import { Sidebar } from '@/components/layout/Sidebar';
import { AgentsTab } from '@/components/tabs/AgentsTab';
import { TasksTab } from '@/components/tabs/TasksTab';
import { MeetingTab } from '@/components/tabs/MeetingTab';
import { AnalyticsTab } from '@/components/tabs/AnalyticsTab';
import { SettingsTab } from '@/components/tabs/SettingsTab';
import { useAgentContext } from '@/lib/agent-context';

export type TabType = 'agents' | 'tasks' | 'meeting' | 'analytics' | 'settings';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('agents');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { agents, fetchAgents } = useAgentContext();

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'agents': return 'Agent Manager';
      case 'tasks': return 'Task Board';
      case 'meeting': return 'Meeting Room';
      case 'analytics': return 'Analytics';
      case 'settings': return 'Settings';
    }
  };

  const getHeaderActions = () => {
    if (activeTab === 'agents') {
      return (
        <>
          <button className="px-3 py-1.5 bg-black text-amber-400 text-sm flex items-center gap-2 border border-amber-500/50 hover:bg-amber-950/30 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" x2="12" y1="19" y2="22"/>
            </svg>
            <span>Broadcast</span>
          </button>
          <button className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-sm flex items-center gap-2 shadow-lg shadow-orange-500/20 border border-orange-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14"/>
              <path d="M12 5v14"/>
            </svg>
            <span>New Agent</span>
          </button>
        </>
      );
    }
    if (activeTab === 'tasks') {
      return (
        <button className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-sm flex items-center gap-2 shadow-lg shadow-orange-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14"/>
            <path d="M12 5v14"/>
          </svg>
          <span>New Task</span>
        </button>
      );
    }
    return null;
  };

  return (
    <div className="flex h-screen w-full relative z-10">
      <NeuralBackground />
      
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        agentCount={agents.length}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-black/50 relative">
        {/* Header */}
        <header className="h-16 glass border-b border-white/10 flex items-center justify-between px-4 shrink-0 z-40">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-white tracking-wide font-inter">{getTabTitle()}</h2>
            <span className="px-2 py-0.5 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <div className="w-1 h-1 bg-emerald-500 animate-pulse"></div>
              Live
            </span>
          </div>
          <div className="flex items-center gap-2">
            {getHeaderActions()}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 relative overflow-hidden">
          {activeTab === 'agents' && <AgentsTab />}
          {activeTab === 'tasks' && <TasksTab />}
          {activeTab === 'meeting' && <MeetingTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </main>
    </div>
  );
}
