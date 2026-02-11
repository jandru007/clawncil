'use client';

import { useState } from 'react';
import { AgentList } from '@/components/agents/AgentList';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { ContextPanel } from '@/components/layout/ContextPanel';
import { cn } from '@/lib/utils';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
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

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <div className="w-px h-6 bg-border mx-2" />
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-medium">J</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Agent List */}
        <div
          className={cn(
            "border-r border-border flex-shrink-0 transition-all duration-300",
            leftPanelOpen ? 'w-72' : 'w-0 overflow-hidden'
          )}
        >
          <AgentList />
        </div>

        {/* Toggle Left */}
        <button
          onClick={() => setLeftPanelOpen(!leftPanelOpen)}
          className="w-6 flex items-center justify-center border-r border-border hover:bg-secondary transition-colors"
        >
          <svg
            className={cn("w-4 h-4 text-muted-foreground transition-transform", !leftPanelOpen && "rotate-180")}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Center Panel - Chat or Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {children}
        </div>

        {/* Toggle Right */}
        <button
          onClick={() => setRightPanelOpen(!rightPanelOpen)}
          className="w-6 flex items-center justify-center border-l border-border hover:bg-secondary transition-colors"
        >
          <svg
            className={cn("w-4 h-4 text-muted-foreground transition-transform", !rightPanelOpen && "rotate-180")}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Right Panel - Context */}
        <div
          className={cn(
            "border-l border-border flex-shrink-0 transition-all duration-300",
            rightPanelOpen ? 'w-80' : 'w-0 overflow-hidden'
          )}
        >
          <ContextPanel />
        </div>
      </div>
    </div>
  );
}
