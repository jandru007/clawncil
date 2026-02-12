'use client';

import { AgentProvider, useAgentContext } from '@/lib/agent-context';
import { AgentList } from '@/components/agents/AgentList';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { ContextPanel } from '@/components/layout/ContextPanel';
import { useState } from 'react';
import { cn } from '@/lib/utils';

function DashboardContent() {
  const { selectedAgent } = useAgentContext();
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  return (
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
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-xs font-medium">J</span>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex overflow-hidden">
        <div className={cn("border-r border-border flex-shrink-0 transition-all", leftPanelOpen ? 'w-72' : 'w-0 overflow-hidden')}>
          <AgentList />
        </div>

        <button onClick={() => setLeftPanelOpen(!leftPanelOpen)} className="w-6 flex items-center justify-center border-r border-border hover:bg-secondary">
          <svg className={cn("w-4 h-4 text-muted-foreground", !leftPanelOpen && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex-1 flex flex-col min-w-0">
          {selectedAgent ? (
            <ChatPanel />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <h1 className="text-2xl font-semibold mb-2">Welcome to Clawncil</h1>
                <p>Select an agent from the sidebar to start a conversation</p>
              </div>
            </div>
          )}
        </div>

        <button onClick={() => setRightPanelOpen(!rightPanelOpen)} className="w-6 flex items-center justify-center border-l border-border hover:bg-secondary">
          <svg className={cn("w-4 h-4 text-muted-foreground", !rightPanelOpen && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className={cn("border-l border-border flex-shrink-0 transition-all", rightPanelOpen ? 'w-80' : 'w-0 overflow-hidden')}>
          <ContextPanel />
        </div>
      </div>
    </div>
  );
}

export function DashboardLayout() {
  return (
    <AgentProvider>
      <DashboardContent />
    </AgentProvider>
  );
}
