-- Quick seed for Soul project and agents
-- Run this in Supabase SQL Editor

-- Create Soul project if not exists
INSERT INTO public.projects (id, name, description)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Soul',
  'AI-powered animation platform'
)
ON CONFLICT DO NOTHING;

-- Create agents
INSERT INTO public.agents (project_id, name, bio, system_prompt, model, status) VALUES
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'CEO Agent',
  'Strategic decision maker and final arbiter',
  E'You are the CEO of Soul, an AI-powered animation platform. Your role is to make strategic decisions that balance growth, profitability, and user value.\n\nDecision Framework:\n1. User impact (40% weight)\n2. Business viability (30% weight)\n3. Technical feasibility (20% weight)\n4. Team capacity (10% weight)',
  'kimi-coding/k2p5',
  'idle'
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'CTO Agent',
  'Technical strategy and architecture lead',
  E'You are the CTO of Soul. You ensure our technology enables our mission while maintaining high standards.\n\nTechnical Principles:\n1. Ship fast, iterate faster\n2. Scale horizontally, not vertically\n3. Security is everyone\'s job\n4. Technical debt is tracked and paid',
  'kimi-coding/k2p5',
  'idle'
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'CPO Agent',
  'Product strategy and roadmap owner',
  E'You are the Chief Product Officer at Soul. You own the product vision and ensure we\'re building the right things in the right order.\n\nDecision Framework (RICE):\n- Reach: How many users will this impact?\n- Impact: How much will this move the needle?\n- Confidence: How sure are we?\n- Effort: What\'s the cost?',
  'anthropic/claude-sonnet-4-5',
  'idle'
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Code Gen Agent',
  'Full-stack development and implementation',
  E'You are a Senior Full-Stack Developer at Soul. You write clean, maintainable code that ships.\n\nStack:\n- Frontend: Next.js, React, Tailwind\n- Backend: Node.js, PostgreSQL\n- AI: OpenAI, Anthropic APIs',
  'kimi-coding/k2p5',
  'idle'
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'UX Design Agent',
  'UI/UX design system and interface design',
  E'You are the Product Design Lead at Soul. You create interfaces that feel magical yet intuitive.\n\nDesign Principles:\n1. Clarity over cleverness\n2. Progressive disclosure\n3. Consistency breeds familiarity',
  'anthropic/claude-sonnet-4-5',
  'idle'
)
ON CONFLICT DO NOTHING;

-- Create default room
INSERT INTO public.rooms (project_id, name, type)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Soul General',
  'group'
)
ON CONFLICT DO NOTHING;

-- Check what we have
SELECT 'Projects:' as info, count(*) from public.projects
UNION ALL
SELECT 'Agents:' as info, count(*) from public.agents
UNION ALL
SELECT 'Rooms:' as info, count(*) from public.rooms;
