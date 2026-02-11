-- Enable RLS
alter table if exists public.projects enable row level security;
alter table if exists public.agents enable row level security;
alter table if exists public.tasks enable row level security;
alter table if exists public.messages enable row level security;
alter table if exists public.rooms enable row level security;

-- Projects table
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Agents table
create table if not exists public.agents (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  parent_id uuid references public.agents(id) on delete set null,
  name text not null,
  bio text,
  system_prompt text not null,
  model text not null default 'kimi-coding/k2p5',
  avatar text,
  status text default 'idle' check (status in ('idle', 'busy', 'offline')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tasks table
create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  agent_id uuid references public.agents(id) on delete set null,
  title text not null,
  description text,
  status text default 'todo' check (status in ('todo', 'in_progress', 'review', 'done')),
  priority text default 'medium' check (priority in ('low', 'medium', 'high')),
  deliverables text[],
  due_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Rooms table
create table if not exists public.rooms (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  name text not null,
  type text default 'group' check (type in ('dm', 'group', 'broadcast', 'meeting')),
  participant_ids uuid[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Messages table
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  room_id uuid references public.rooms(id) on delete cascade not null,
  sender_id text not null,
  sender_type text check (sender_type in ('user', 'agent')),
  content text not null,
  type text default 'text' check (type in ('text', 'task_update', 'deliverable', 'broadcast')),
  metadata jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes
create index if not exists agents_project_id_idx on public.agents(project_id);
create index if not exists agents_parent_id_idx on public.agents(parent_id);
create index if not exists tasks_project_id_idx on public.tasks(project_id);
create index if not exists tasks_agent_id_idx on public.tasks(agent_id);
create index if not exists messages_room_id_idx on public.messages(room_id);
create index if not exists rooms_project_id_idx on public.rooms(project_id);

-- Realtime
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.agents;
alter publication supabase_realtime add table public.tasks;
