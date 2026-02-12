import { NextRequest, NextResponse } from 'next/server';

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://127.0.0.1:18789';
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const { agentId, agentName, model, systemPrompt, message } = await request.json();

    if (!message || !systemPrompt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Call OpenClaw gateway to spawn a session
    const response = await fetch(`${GATEWAY_URL}/v1/sessions/spawn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GATEWAY_TOKEN}`,
      },
      body: JSON.stringify({
        agentId: `clawncil-${agentId}`,
        model: model || 'kimi-coding/k2p5',
        systemPrompt,
        message,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenClaw spawn error:', error);
      return NextResponse.json(
        { error: 'Failed to spawn agent session' },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      response: data.response || data.text || 'No response from agent',
      sessionKey: data.sessionKey,
    });
  } catch (error) {
    console.error('Spawn error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
