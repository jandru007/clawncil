'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Agent } from '@/lib/types';
import { cn } from '@/lib/utils';

export function AgentList() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching agents...');
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: true });

      console.log('Response:', { data, error });

      if (error) throw error;
      setAgents(data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const filteredAgents = agents.filter((a) =>
    a.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Agents ({agents.length})
          </span>
          <button 
            onClick={fetchAgents}
            className="p-1.5 hover:bg-secondary rounded transition-colors"
            title="Refresh"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-500/10 border-b border-red-500/20">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="p-4 text-center text-muted-foreground">
          <p className="text-sm">Loading agents...</p>
        </div>
      )}

      {/* Agent List */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <div className="p-2 space-y-1">
          {filteredAgents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left",
                selectedAgent?.id === agent.id
                  ? "bg-primary/10 border border-primary/20"
                  : "hover:bg-secondary"
              )}
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
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
                <p className="text-xs text-muted-foreground truncate">{agent.model}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
