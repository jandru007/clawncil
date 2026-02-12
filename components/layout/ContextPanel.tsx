'use client';

import { useAgentContext } from "@/lib/agent-context";
import { useState } from 'react';

export function ContextPanel() {
  const { selectedAgent } = useAgentContext();
  const [activeTab, setActiveTab] = useState<'agent' | 'task' | 'docs'>('agent');

  return (
    <div className="h-full flex flex-col">
      <div className="flex border-b border-border">
        {(['agent', 'task', 'docs'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors ${
              activeTab === tab ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'agent' && selectedAgent && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">{selectedAgent.name}</h3>
              <p className="text-xs text-muted-foreground">{selectedAgent.bio}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Model: </span>
              <span className="text-xs">{selectedAgent.model}</span>
            </div>
          </div>
        )}

        {activeTab === 'agent' && !selectedAgent && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Select an agent to view details</p>
          </div>
        )}

        {activeTab === 'task' && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No tasks yet</p>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No documents selected</p>
          </div>
        )}
      </div>
    </div>
  );
}
