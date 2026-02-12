import { NextRequest, NextResponse } from 'next/server';
import { updateAgentSOUL } from '@/lib/openclaw/config';

export async function POST(request: NextRequest) {
  try {
    const { agentId, bio, systemPrompt } = await request.json();

    if (!agentId || !systemPrompt) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await updateAgentSOUL(agentId, bio, systemPrompt);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating agent:', error);
    return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 });
  }
}
