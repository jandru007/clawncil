'use client';

import { useState, useEffect } from 'react';
import { useAgentContext } from '@/lib/agent-context';
import { cn } from '@/lib/utils';

export function SettingsTab() {
  const { agents, createAgent } = useAgentContext();
  const [selectedAgent, setSelectedAgent] = useState<typeof agents[0] | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: '',
    model: 'kimi-coding/k2p5',
    bio: '',
    systemPrompt: '',
  });

  const models = [
    { id: 'kimi-coding/k2p5', name: 'KimiK (Unlimited)' },
    { id: 'anthropic/claude-sonnet-4-5', name: 'Claude Sonnet' },
    { id: 'anthropic/claude-opus-4-6', name: 'Claude Opus' },
    { id: 'openai/gpt-5-mini', name: 'GPT-5 Mini' },
  ];

  const handleCreateAgent = async () => {
    if (!newAgent.name || !newAgent.systemPrompt) return;
    
    await createAgent({
      name: newAgent.name,
      model: newAgent.model,
      bio: newAgent.bio,
      system_prompt: newAgent.systemPrompt,
    });
    
    setShowCreateModal(false);
    setNewAgent({ name: '', model: 'kimi-coding/k2p5', bio: '', systemPrompt: '' });
  };

  if (selectedAgent) {
    return <AgentDetail agent={selectedAgent} onBack={() => setSelectedAgent(null)} />;
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white font-inter">Agent Settings</h2>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14"/>
              <path d="M12 5v14"/>
            </svg>
            New Agent
          </button>
        </div>

        {/* Agent List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className="glass p-4 border border-white/5 hover:border-white/10 text-left transition-all hover:translate-y-[-2px]"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-zinc-800 flex items-center justify-center text-lg font-bold text-zinc-400">
                  {agent.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{agent.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{agent.model}</p>
                  <p className="text-xs text-zinc-600 line-clamp-1 mt-1">{agent.bio || 'No bio'}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Create Agent Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white font-inter">Create New Agent</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-zinc-500 hover:text-white">&times;</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-zinc-500 uppercase font-bold mb-1.5 block font-inter">Name</label>
                <input
                  type="text"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                  placeholder="e.g., CEO Agent"
                  className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white focus:border-orange-500/50 outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs text-zinc-500 uppercase font-bold mb-1.5 block font-inter">Model</label>
                <select
                  value={newAgent.model}
                  onChange={(e) => setNewAgent({ ...newAgent, model: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white focus:border-orange-500/50 outline-none"
                >
                  {models.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-500 uppercase font-bold mb-1.5 block font-inter">Bio / Soul</label>
                <textarea
                  value={newAgent.bio}
                  onChange={(e) => setNewAgent({ ...newAgent, bio: e.target.value })}
                  placeholder="Short description of this agent's personality and role..."
                  rows={2}
                  className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white focus:border-orange-500/50 outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-500 uppercase font-bold mb-1.5 block font-inter">System Prompt</label>
                <textarea
                  value={newAgent.systemPrompt}
                  onChange={(e) => setNewAgent({ ...newAgent, systemPrompt: e.target.value })}
                  placeholder="You are an expert in... Define how this agent should behave and respond."
                  rows={4}
                  className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white focus:border-orange-500/50 outline-none resize-none mono text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-zinc-800 text-zinc-400 text-sm hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAgent}
                  disabled={!newAgent.name || !newAgent.systemPrompt}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white text-sm hover:bg-orange-500 disabled:opacity-50 transition-colors"
                >
                  Create Agent
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AgentDetail({ agent, onBack }: { agent: any; onBack: () => void }) {
  const [edited, setEdited] = useState({
    name: agent.name,
    bio: agent.bio || '',
    systemPrompt: agent.system_prompt || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/agents/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentId: agent.id,
        bio: edited.bio,
        systemPrompt: edited.systemPrompt,
      }),
    });
    setSaving(false);
    onBack();
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-3xl mx-auto py-8 px-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m12 19-7-7 7-7"/>
            <path d="M19 12H5"/>
          </svg>
          <span>Back to Agents</span>
        </button>

        <div className="glass-panel p-6 border border-white/10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-zinc-800 flex items-center justify-center text-2xl font-bold text-zinc-400">
              {agent.name.charAt(0)}
            </div>
            <div>
              <input
                type="text"
                value={edited.name}
                onChange={(e) => setEdited({ ...edited, name: e.target.value })}
                className="text-xl font-bold text-white bg-transparent border-b border-transparent hover:border-zinc-700 focus:border-orange-500 outline-none font-inter"
              />
              <p className="text-sm text-zinc-500 mono">{agent.id}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold mb-1.5 block font-inter">Model</label>
              <p className="text-sm text-zinc-300">{agent.model}</p>
            </div>

            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold mb-1.5 block font-inter">Bio / Soul</label>
              <textarea
                value={edited.bio}
                onChange={(e) => setEdited({ ...edited, bio: e.target.value })}
                rows={3}
                className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white focus:border-orange-500/50 outline-none resize-none"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold mb-1.5 block font-inter">System Prompt (SOUL)</label>
              <textarea
                value={edited.systemPrompt}
                onChange={(e) => setEdited({ ...edited, systemPrompt: e.target.value })}
                rows={8}
                className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white focus:border-orange-500/50 outline-none resize-none mono text-xs"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={onBack}
                className="px-4 py-2 bg-zinc-800 text-zinc-400 text-sm hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-orange-600 text-white text-sm hover:bg-orange-500 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
