'use client';

import { useEffect, useRef, useState } from 'react';
import { useChatStore } from '@/stores/chat';
import { useAgentStore } from '@/stores/agents';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  sender_id: string;
  sender_type: 'user' | 'agent';
  content: string;
  created_at: string;
}

export function ChatPanel() {
  const { messages, fetchMessages, sendMessage, subscribeToRoom } = useChatStore();
  const { selectedAgent } = useAgentStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Hardcoded room ID for now (Soul General)
  const roomId = '00000000-0000-0000-0000-000000000000';

  useEffect(() => {
    fetchMessages(roomId);
    unsubscribeRef.current = subscribeToRoom(roomId);
    return () => unsubscribeRef.current?.();
  }, [fetchMessages, subscribeToRoom, roomId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !selectedAgent) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      // 1. Send user message
      await sendMessage(roomId, userMessage, 'user', 'user');

      // 2. Spawn OpenClaw session for agent response
      const response = await fetch('/api/spawn', {
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

      if (!response.ok) throw new Error('Failed to spawn agent');

      const data = await response.json();

      // 3. Send agent response
      await sendMessage(roomId, data.response, selectedAgent.id, 'agent');
    } catch (err) {
      console.error('Failed to send message:', err);
      await sendMessage(
        roomId,
        'Sorry, I encountered an error processing your message.',
        selectedAgent.id,
        'agent'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="h-14 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-medium">{selectedAgent?.name.charAt(0) || '?'}</span>
          </div>
          <div>
            <p className="font-medium">{selectedAgent?.name || 'Select an agent'}</p>
            <p className="text-xs text-muted-foreground">
              {selectedAgent?.status === 'idle' ? 'Online' : selectedAgent?.status || 'Offline'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-auto custom-scrollbar p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No messages yet</p>
            <p className="text-sm">Select an agent and start a conversation</p>
          </div>
        ) : (
          messages.map((message: Message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.sender_type === 'user' ? "flex-row-reverse" : ""
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0",
                  message.sender_type === 'user'
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary"
                )}
              >
                {message.sender_type === 'user' ? 'You' : message.sender_id.charAt(0)}
              </div>

              <div
                className={cn(
                  "max-w-[70%] px-4 py-2 rounded-2xl",
                  message.sender_type === 'user'
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-secondary rounded-bl-md"
                )}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-[10px] opacity-70 mt-1">{formatTime(message.created_at)}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-xs">{selectedAgent?.name.charAt(0)}</span>
            </div>
            <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
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
            placeholder={selectedAgent ? `Message ${selectedAgent.name}...` : 'Select an agent first...'}
            disabled={!selectedAgent || isLoading}
            className="flex-1 bg-secondary border-0 rounded-lg px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || !selectedAgent || isLoading}
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
