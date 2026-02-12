'use client';

import { useState, useEffect, useRef } from 'react';
import { useAgentContext } from '@/lib/agent-context';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  sender: string;
  senderType: 'user' | 'agent';
  content: string;
  timestamp: Date;
  agentId?: string;
}

export function MeetingTab() {
  const { agents, selectedAgent, selectAgent } = useAgentContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !selectedAgent) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'You',
      senderType: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      // Spawn OpenClaw session
      const spawnRes = await fetch('/api/spawn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: selectedAgent.id,
          agentName: selectedAgent.name,
          model: selectedAgent.model,
          systemPrompt: selectedAgent.system_prompt,
          message: userMessage,
        }),
      });

      if (!spawnRes.ok) throw new Error('Spawn failed');
      const data = await spawnRes.json();

      // Add agent response
      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: selectedAgent.name,
        senderType: 'agent',
        content: data.response,
        timestamp: new Date(),
        agentId: selectedAgent.id,
      };
      setMessages(prev => [...prev, agentMsg]);

      // Save to MEMORY.md
      await fetch('/api/chat/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: selectedAgent.id,
          message: userMessage,
          response: data.response,
        }),
      });

    } catch (err) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: selectedAgent.name,
        senderType: 'agent',
        content: 'Sorry, I encountered an error processing your request.',
        timestamp: new Date(),
        agentId: selectedAgent.id,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const activeAgents = agents.filter(a => a.status === 'idle' || a.status === 'busy');

  return (
    <div className="h-full flex">
      {/* Chat Area */}
      <div className="flex-[2] flex flex-col min-w-0 bg-black/50 border-r border-white/10 h-full">
        <div className="h-14 border-b border-white/10 flex items-center px-4 bg-zinc-950/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-700/50 flex items-center justify-center border border-orange-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-200">
                <line x1="4" x2="20" y1="9" y2="9"/>
                <line x1="4" x2="20" y1="15" y2="15"/>
                <line x1="10" x2="8" y1="3" y2="21"/>
                <line x1="16" x2="14" y1="3" y2="21"/>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm font-inter">
                {selectedAgent ? selectedAgent.name : 'Select an agent'}
              </h3>
              <p className="text-xs text-zinc-600">
                {selectedAgent ? selectedAgent.model : 'Click an agent in the list'}
              </p>
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-zinc-600 text-sm">
              {selectedAgent 
                ? `Start a conversation with ${selectedAgent.name}` 
                : 'Select an agent from the right panel to start chatting'}
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={cn(
                  "flex gap-3",
                  msg.senderType === 'user' ? "flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-8 h-8 flex items-center justify-center text-xs font-medium shrink-0",
                  msg.senderType === 'user' 
                    ? "bg-orange-600 text-white" 
                    : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                )}>
                  {msg.senderType === 'user' ? 'You' : msg.sender.charAt(0)}
                </div>
                <div className={cn(
                  "max-w-[70%] px-4 py-2 text-sm",
                  msg.senderType === 'user'
                    ? "bg-orange-600 text-white"
                    : "bg-zinc-800 text-zinc-200 border border-zinc-700"
                )}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-zinc-800 flex items-center justify-center text-xs text-zinc-400 border border-zinc-700">
                {selectedAgent?.name.charAt(0)}
              </div>
              <div className="bg-zinc-800 border border-zinc-700 px-4 py-2">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-zinc-500 animate-bounce"/>
                  <span className="w-1.5 h-1.5 bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }}/>
                  <span className="w-1.5 h-1.5 bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }}/>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-white/10 bg-zinc-950/30">
          <div className="flex gap-2">
            <button className="p-2.5 hover:bg-white/5 text-zinc-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14"/>
                <path d="M12 5v14"/>
              </svg>
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={selectedAgent ? `Message ${selectedAgent.name}...` : 'Select an agent first...'}
              disabled={!selectedAgent || isLoading}
              className="flex-1 bg-zinc-900/50 border border-zinc-800 px-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500/50 transition-colors font-inter disabled:opacity-50"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || !selectedAgent || isLoading}
              className="p-2.5 bg-orange-600 hover:bg-orange-500 text-white transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m22 2-7 20-4-9-9-4Z"/>
                <path d="M22 2 11 13"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Agent List + Live Feed */}
      <div className="flex-1 flex flex-col glass border-l border-white/10 shrink-0 h-full">
        {/* Active Agents */}
        <div className="h-1/2 flex flex-col border-b border-white/10">
          <div className="p-3 border-b border-white/10 flex items-center justify-between shrink-0">
            <span className="font-semibold text-sm text-white font-inter">Active Agents</span>
            <span className="text-xs text-zinc-500 bg-zinc-900 px-2 py-0.5">{activeAgents.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {activeAgents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => selectAgent(agent)}
                className={cn(
                  "w-full flex items-center gap-2 p-2 text-left transition-all",
                  selectedAgent?.id === agent.id
                    ? "bg-orange-500/10 border border-orange-500/30"
                    : "hover:bg-white/5 border border-transparent"
                )}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-400">
                    {agent.name.charAt(0)}
                  </div>
                  <span className={cn(
                    "absolute -bottom-0.5 -right-0.5 w-2 h-2 border border-black",
                    agent.status === 'idle' && "bg-emerald-500",
                    agent.status === 'busy' && "bg-orange-500 animate-pulse",
                  )}/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{agent.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{agent.model}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Updates */}
        <div className="h-1/2 flex flex-col">
          <div className="p-3 border-b border-white/10 shrink-0">
            <span className="font-semibold text-sm text-white flex items-center gap-2 font-inter">
              <span className="w-2 h-2 bg-emerald-500 animate-pulse"/>
              Live Updates
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            <div className="text-center py-8 text-zinc-600 text-sm">
              Activity feed coming soon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
