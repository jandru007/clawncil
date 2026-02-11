// Database Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Agent {
  id: string;
  project_id: string;
  parent_id?: string;
  name: string;
  bio: string;
  system_prompt: string;
  model: string;
  avatar?: string;
  status: 'idle' | 'busy' | 'offline';
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  agent_id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  deliverables?: string[];
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  sender_type: 'user' | 'agent';
  content: string;
  type: 'text' | 'task_update' | 'deliverable' | 'broadcast';
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Room {
  id: string;
  project_id: string;
  name: string;
  type: 'dm' | 'group' | 'broadcast' | 'meeting';
  participant_ids: string[];
  created_at: string;
}

// OpenClaw Types
export interface SpawnSessionRequest {
  agentId: string;
  model: string;
  systemPrompt: string;
  message: string;
}

export interface SpawnSessionResponse {
  sessionKey: string;
  response: string;
}
