import { NextRequest, NextResponse } from 'next/server';
import { readOpenClawConfig, createAgentInOpenClaw } from '@/lib/openclaw/config';

export async function GET() {
  try {
    const config = await readOpenClawConfig();
    if (!config) {
      return NextResponse.json({ error: 'OpenClaw config not found' }, { status: 500 });
    }

    // Transform OpenClaw agents to Clawncil format
    const agents = config.agents.list.map((agent) => ({
      id: agent.id,
      name: agent.name || agent.id,
      bio: agent.systemPrompt?.slice(0, 100) + '...' || 'No bio',
      system_prompt: agent.systemPrompt || '',
      model: agent.model,
      parent_id: agent.parentId,
      status: 'idle', // We'll track this separately
    }));

    return NextResponse.json({ agents });
  } catch (error) {
    console.error('Error reading agents:', error);
    return NextResponse.json({ error: 'Failed to read agents' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, model, systemPrompt, parentId } = await request.json();

    if (!name || !model) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const agentId = name.toLowerCase().replace(/\s+/g, '-');

    await createAgentInOpenClaw(agentId, name, model, systemPrompt, parentId);

    return NextResponse.json({ 
      success: true, 
      agent: { 
        id: agentId, 
        name, 
        model, 
        parent_id: parentId 
      } 
    });
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 });
  }
}
