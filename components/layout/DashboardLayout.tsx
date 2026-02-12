'use client';

import { AgentProvider } from '@/lib/agent-context';
import { AgentList } from '@/components/agents/AgentList';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { ContextPanel } from '@/components/layout/ContextPanel';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  return (
    <AgentProvider>
      <div className="h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="h-14 border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg sea-gradient flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <h1 className="font-semibold">Clawncil</h1>
            <span className="text-xs text-muted-foreground px-2 py-0.5 bg-secondary rounded">Beta</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xs font-medium">J</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel */}
          <div className={cn("border-r border-border flex-shrink-0 transition-all duration-300", leftPanelOpen ? 'w-72' : 'w-0 overflow-hidden')}>
            <AgentList />
          </div>

          <button onClick={() => setLeftPanelOpen(!leftPanelOpen)} className="w-6 flex items-center justify-center border-r border-border hover:bg-secondary">
            <svg className={cn("w-4 h-4 text-muted-foreground transition-transform", !leftPanelOpen && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Center */}
          <div className="flex-1 flex flex-col min-w-0">
            {children}
          </div>

          <button onClick={() => setRightPanelOpen(!rightPanelOpen)} className="w-6 flex items-center justify-center border-l border-border hover:bg-secondary">
            <svg className={cn("w-4 h-4 text-muted-foreground transition-transform", !rightPanelOpen && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Right Panel */}
          <div className={cn("border-l border-border flex-shrink-0 transition-all duration-300", rightPanelOpen ? 'w-80' : 'w-0 overflow-hidden')}>
            <ContextPanel />
          </div>
        </div>
      </div>
    </AgentProvider>
  );
}
