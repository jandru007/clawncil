'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Agent } from '@/lib/types';

interface AgentContextType {
  agents: Agent[];
  selectedAgent: Agent | null;
  loading: boolean;
  error: string | null;
  setAgents: (agents: Agent[]) => void;
  setSelectedAgent: (agent: Agent | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <AgentContext.Provider
      value={{
        agents,
        selectedAgent,
        loading,
        error,
        setAgents,
        setSelectedAgent,
        setLoading,
        setError,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}

export function useAgentContext() {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgentContext must be used within AgentProvider');
  }
  return context;
}
