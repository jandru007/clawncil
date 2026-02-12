import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Agent } from '@/lib/types';

interface AgentState {
  agents: Agent[];
  selectedAgent: Agent | null;
  loading: boolean;
  error: string | null;
  fetchAgents: () => Promise<void>;
  selectAgent: (agent: Agent | null) => void;
  updateAgentStatus: (id: string, status: Agent['status']) => Promise<void>;
}

export const useAgentStore = create<AgentState>((set, get) => ({
  agents: [],
  selectedAgent: null,
  loading: false,
  error: null,

  fetchAgents: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      set({ agents: data || [], loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch agents', loading: false });
    }
  },

  selectAgent: (agent) => {
    set({ selectedAgent: agent });
  },

  updateAgentStatus: async (id, status) => {
    try {
      const { error } = await supabase
        .from('agents')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      set((state) => ({
        agents: state.agents.map((a) =>
          a.id === id ? { ...a, status } : a
        ),
      }));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  },
}));
