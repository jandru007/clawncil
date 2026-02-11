'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export function ContextPanel() {
  const [activeTab, setActiveTab] = useState<'agent' | 'task' | 'docs'>('agent');

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-border">
        {(['agent', 'task', 'docs'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors",
              activeTab === tab
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'agent' && (
          <div className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">Select an agent to view details</p>
            </div>
          </div>
        )}

        {activeTab === 'task' && (
          <div className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">Select a task to view details</p>
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No documents selected</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
