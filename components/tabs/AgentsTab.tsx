'use client';

import { useState } from 'react';
import { useAgentContext } from '@/lib/agent-context';
import { Agent } from '@/lib/types';
import { cn } from '@/lib/utils';

const departments = ['Business', 'Marketing', 'Product', 'Technical'];

const statusColors: Record<string, string> = {
  idle: 'bg-emerald-500',
  busy: 'bg-amber-500',
  offline: 'bg-zinc-500',
};

export function AgentsTab() {
  const { agents, selectedAgent, setSelectedAgent } = useAgentContext();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredAgents = agents.filter((agent) => {
    if (filter !== 'all' && agent.status !== filter) return false;
    if (search && !agent.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const onlineCount = agents.filter((a) => a.status === 'idle').length;
  const busyCount = agents.filter((a) => a.status === 'busy').length;

  const getAgentsByDepartment = (dept: string) => {
    // For now, assign departments based on agent name patterns
    // In real implementation, this would come from the database
    if (dept === 'Business') return filteredAgents.filter((a) => 
      a.name.includes('CEO') || a.name.includes('CMO')
    );
    if (dept === 'Marketing') return filteredAgents.filter((a) => 
      a.name.includes('Content') || a.name.includes('Growth')
    );
    if (dept === 'Product') return filteredAgents.filter((a) => 
      a.name.includes('CPO') || a.name.includes('UX') || a.name.includes('Research')
    );
    if (dept === 'Technical') return filteredAgents.filter((a) => 
      a.name.includes('CTO') || a.name.includes('Code') || a.name.includes('DevOps') || a.name.includes('Security')
    );
    return [];
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 custom-scrollbar">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="glass p-4 border border-white/5 card-hover">
          <div className="flex justify-between items-start mb-2">
            <div className="p-1.5 bg-zinc-800 text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 8V4H8"/>
                <rect width="16" height="12" x="4" y="8" rx="2"/>
                <path d="M2 14h2"/>
                <path d="M20 14h2"/>
                <path d="M15 13v2"/>
                <path d="M9 13v2"/>
              </svg>
            </div>
            <span className="text-xs text-emerald-400">+12%</span>
          </div>
          <div className="text-2xl font-bold text-white">{agents.length}</div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider">Total Agents</div>
        </div>

        <div className="glass p-4 border border-white/5 card-hover">
          <div className="p-1.5 bg-zinc-800 text-emerald-400 w-fit mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>
            </svg>
          </div>
          <div className="text-2xl font-bold text-white">{onlineCount}</div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider">Online</div>
        </div>

        <div className="glass p-4 border border-white/5 card-hover">
          <div className="p-1.5 bg-zinc-800 text-amber-400 w-fit mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4"/>
              <path d="m16.2 7.8 2.9-2.9"/>
              <path d="M18 12h4"/>
              <path d="m16.2 16.2 2.9 2.9"/>
              <path d="M12 18v4"/>
              <path d="m7.8 16.2-2.9 2.9"/>
              <path d="M6 12H2"/>
              <path d="m7.8 7.8-2.9-2.9"/>
            </svg>
          </div>
          <div className="text-2xl font-bold text-white">{busyCount}</div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider">Processing</div>
        </div>

        <div className="glass p-4 border border-white/5 card-hover">
          <div className="p-1.5 bg-zinc-800 text-zinc-400 w-fit mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <div className="text-2xl font-bold text-white">94%</div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider">Efficiency</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['all', 'online', 'busy', 'offline'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium border transition-all font-inter",
                filter === f
                  ? "bg-orange-600 text-white border-orange-500"
                  : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700"
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            type="text"
            placeholder="Search agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-zinc-900/50 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500/50 transition-colors font-inter"
          />
        </div>
      </div>

      {/* Agent Grid by Department */}
      <div className="space-y-6 pb-20">
        {departments.map((dept) => {
          const deptAgents = getAgentsByDepartment(dept);
          if (deptAgents.length === 0) return null;
          
          return (
            <div key={dept} className="animate-slide-in">
              <div className="dept-header flex items-center gap-3 px-4 py-2 mb-3 border-l-2 border-orange-500 bg-gradient-to-r from-orange-500/10 to-transparent">
                <span className="font-semibold text-white">{dept}</span>
                <span className="text-xs text-zinc-500 bg-zinc-900 px-2 py-0.5">{deptAgents.length}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {deptAgents.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className={cn(
                      "glass p-4 border text-left transition-all hover:translate-y-[-2px] hover:shadow-lg",
                      selectedAgent?.id === agent.id
                        ? "border-orange-500/50 bg-orange-500/5"
                        : "border-white/5 hover:border-white/10"
                    )}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-zinc-800 flex items-center justify-center text-lg font-bold text-zinc-400"
003e
                          {agent.name.charAt(0)}
                        </div>
                        <span className={cn("absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-black", statusColors[agent.status])} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{agent.name}</p>
                        <p className="text-xs text-zinc-500 truncate">{agent.model}</p>
                      </div>
                    </div>
                    
                    <p className="text-xs text-zinc-400 line-clamp-2 mb-3">{agent.bio || 'No bio available'}</p>
                    
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 border",
                        agent.status === 'idle' && "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
                        agent.status === 'busy' && "text-amber-400 border-amber-500/30 bg-amber-500/10",
                        agent.status === 'offline' && "text-zinc-400 border-zinc-500/30 bg-zinc-500/10"
                      )}>
                        {agent.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
