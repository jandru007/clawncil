import { promises as fs } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { createContextMD } from './context';

const OPENCLAW_DIR = join(homedir(), '.openclaw');
const CONFIG_PATH = join(OPENCLAW_DIR, 'openclaw.json');

export interface OpenClawAgent {
  id: string;
  name?: string;
  workspace: string;
  model: string;
  systemPrompt?: string;
  parentId?: string;
  tools?: {
    elevated?: { enabled: boolean };
  };
}

export interface OpenClawConfig {
  agents: {
    defaults: {
      model: {
        primary: string;
        fallbacks: string[];
      };
      models: Record<string, { alias: string }>;
    };
    list: OpenClawAgent[];
  };
  gateway: {
    port: number;
    token: string;
  };
}

export async function readOpenClawConfig(): Promise<OpenClawConfig | null> {
  try {
    const content = await fs.readFile(CONFIG_PATH, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export async function writeOpenClawConfig(config: OpenClawConfig): Promise<void> {
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2));
}

export async function createAgentInOpenClaw(
  agentId: string,
  name: string,
  model: string,
  systemPrompt: string,
  parentId?: string
): Promise<void> {
  const config = await readOpenClawConfig();
  if (!config) throw new Error('OpenClaw config not found');

  // Add to agents list
  const newAgent: OpenClawAgent = {
    id: agentId,
    name,
    workspace: join(OPENCLAW_DIR, 'workspace', agentId),
    model,
    systemPrompt,
    parentId,
    tools: {
      elevated: { enabled: false },
    },
  };

  config.agents.list.push(newAgent);
  await writeOpenClawConfig(config);

  // Create workspace directory
  const workspaceDir = join(OPENCLAW_DIR, 'workspace', agentId);
  await fs.mkdir(workspaceDir, { recursive: true });

  // Write SOUL.md
  const soulContent = `# ${name} - SOUL

## Identity
${systemPrompt}

## Purpose
Agent in the Clawncil swarm for project management and execution.

## Capabilities
- Task execution
- Collaboration with other agents
- Communication via chat

## Notes
Created: ${new Date().toISOString()}
Model: ${model}
Parent: ${parentId || 'None'}
`;
  await fs.writeFile(join(workspaceDir, 'SOUL.md'), soulContent);

  // Initialize MEMORY.md
  await fs.writeFile(join(workspaceDir, 'MEMORY.md'), '# Memory\n\n');

  // Create CONTEXT.md
  await createContextMD(workspaceDir, 'Clawncil Swarm', [
    `Agent ${name} created`,
    `Model: ${model}`,
  ]);
}

export async function updateAgentSOUL(agentId: string, bio: string, systemPrompt: string): Promise<void> {
  const workspaceDir = join(OPENCLAW_DIR, 'workspace', agentId);
  const config = await readOpenClawConfig();
  
  if (config) {
    const agent = config.agents.list.find(a => a.id === agentId);
    if (agent) {
      agent.systemPrompt = systemPrompt;
      await writeOpenClawConfig(config);
    }
  }

  const soulContent = `# ${agentId} - SOUL

## Bio
${bio}

## System Prompt
${systemPrompt}

## Notes
Updated: ${new Date().toISOString()}
`;
  await fs.writeFile(join(workspaceDir, 'SOUL.md'), soulContent);
}

export async function appendToAgentMemory(agentId: string, content: string): Promise<void> {
  const workspaceDir = join(OPENCLAW_DIR, 'workspace', agentId);
  const memoryPath = join(workspaceDir, 'MEMORY.md');
  
  const timestamp = new Date().toISOString();
  const entry = `\n## ${timestamp}\n${content}\n`;
  
  await fs.appendFile(memoryPath, entry);
}
