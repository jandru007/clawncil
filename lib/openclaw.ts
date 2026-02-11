import { SpawnSessionRequest, SpawnSessionResponse } from './types';

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://127.0.0.1:18789';
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN;

export async function spawnAgentSession(request: SpawnSessionRequest): Promise<SpawnSessionResponse> {
  const response = await fetch(`${GATEWAY_URL}/v1/sessions/spawn`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GATEWAY_TOKEN}`,
    },
    body: JSON.stringify({
      agentId: request.agentId,
      model: request.model,
      systemPrompt: request.systemPrompt,
      message: request.message,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to spawn session: ${response.statusText}`);
  }

  return response.json();
}

export async function sendMessageToSession(sessionKey: string, message: string): Promise<string> {
  const response = await fetch(`${GATEWAY_URL}/v1/sessions/${sessionKey}/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GATEWAY_TOKEN}`,
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`);
  }

  const data = await response.json();
  return data.response;
}
