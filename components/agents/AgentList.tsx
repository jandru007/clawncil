'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Agent {
  id: string;
  name: string;
  status: 'idle' | 'busy' | 'offline';
  model: string;
}

const mockAgents: Agent[] = [
  { id: '1', name: 'CEO Agent', status: 'idle', model: 'KimiK' },
  { id: '2', name: 'CTO Agent', status: 'busy', model: 'KimiK' },
  { id: '3', name: 'CPO Agent', status: 'idle', model: 'sonnet' },
];

export function AgentList() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  const filteredAgents = mockAgents.filter((a) =>
    a.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Agents
          </span>
          <button className="p-1.5 hover:bg-secondary rounded transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <input
          type="text"
          placeholder="Search agents..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full bg-secondary border-0 rounded px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Agent List */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <div className="p-2 space-y-1">
          {filteredAgents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left",
                selectedAgent === agent.id
                  ? "bg-primary/10 border border-primary/20"
                  : "hover:bg-secondary"
              )}
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium"
003e
                  {agent.name.charAt(0)}
                </div>
                <span
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background",
                    agent.status === 'idle' && "bg-green-500",
                    agent.status === 'busy' && "bg-yellow-500",
                    agent.status === 'offline' && "bg-gray-500"
                  )}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{agent.name}</p>
                <p className="text-xs text-muted-foreground">{agent.model}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Project Selector */}
      <div className="p-3 border-t border-border">
        <select className="w-full bg-secondary border-0 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
          <option>Soul</option>
          <option>Motion-Embed</option>
          <option>+ New Project</option>
        </select>
      </div>
    </div>
  );
}
