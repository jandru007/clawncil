'use client';

import { useEffect, useRef, useState } from 'react';
import { useAgentContext } from '@/lib/agent-context';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  sender_id: string;
  sender_type: 'user' | 'agent';
  content: string;
  created_at: string;
}

export function ChatPanel() {
  const { selectedAgent } = useAgentContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !selectedAgent) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender_id: 'user',
      sender_type: 'user',
      content: input.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/spawn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: selectedAgent.id,
          agentName: selectedAgent.name,
          model: selectedAgent.model,
          systemPrompt: selectedAgent.system_prompt,
          message: userMessage.content,
        }),
      });

      if (!response.ok) throw new Error('Failed to spawn');

      const data = await response.json();

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender_id: selectedAgent.id,
        sender_type: 'agent',
        content: data.response,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender_id: selectedAgent.id,
          sender_type: 'agent',
          content: 'Sorry, I encountered an error.',
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedAgent) return null;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-14 border-b border-border flex items-center px-4 gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-xs font-medium">{selectedAgent.name.charAt(0)}</span>
        </div>
        <div>
          <p className="font-medium">{selectedAgent.name}</p>
          <p className="text-xs text-muted-foreground">{selectedAgent.status}</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-3", msg.sender_type === 'user' && "flex-row-reverse")}>
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs", msg.sender_type === 'user' ? "bg-primary" : "bg-secondary")}>
              {msg.sender_type === 'user' ? 'You' : selectedAgent.name.charAt(0)}
            </div>
            <div className={cn("max-w-[70%] px-4 py-2 rounded-2xl text-sm", msg.sender_type === 'user' ? "bg-primary rounded-br-md" : "bg-secondary rounded-bl-md")}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">{selectedAgent.name.charAt(0)}</div>
            <div className="bg-secondary rounded-2xl px-4 py-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Message ${selectedAgent.name}...`}
            className="flex-1 bg-secondary border-0 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button onClick={handleSend} disabled={!input.trim() || isLoading} className="p-2 bg-primary rounded-lg disabled:opacity-50">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
