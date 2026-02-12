import { NextRequest, NextResponse } from 'next/server';
import { appendToAgentMemory } from '@/lib/openclaw/config';

export async function POST(request: NextRequest) {
  try {
    const { agentId, message, response } = await request.json();

    if (!agentId || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Format conversation entry
    const conversationEntry = `
**User:** ${message}

**${agentId}:** ${response || '(pending)'}
`;

    // Append to agent's MEMORY.md
    await appendToAgentMemory(agentId, conversationEntry);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving conversation:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
