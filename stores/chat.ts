import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Message } from '@/lib/types';

interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
  fetchMessages: (roomId: string) => Promise<void>;
  sendMessage: (roomId: string, content: string, senderId: string, senderType: 'user' | 'agent') => Promise<void>;
  subscribeToRoom: (roomId: string) => () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  loading: false,
  error: null,

  fetchMessages: async (roomId: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      set({ messages: data || [], loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch messages', loading: false });
    }
  },

  sendMessage: async (roomId: string, content: string, senderId: string, senderType: 'user' | 'agent') => {
    try {
      const { error } = await supabase.from('messages').insert({
        room_id: roomId,
        sender_id: senderId,
        sender_type: senderType,
        content,
        type: 'text',
      });

      if (error) throw error;
    } catch (err) {
      console.error('Failed to send message:', err);
      set({ error: err instanceof Error ? err.message : 'Failed to send message' });
    }
  },

  subscribeToRoom: (roomId: string) => {
    const subscription = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          set((state) => ({
            messages: [...state.messages, payload.new as Message],
          }));
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  },
}));
