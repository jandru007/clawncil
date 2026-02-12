import { promises as fs } from 'fs';
import { join } from 'path';

const CONTEXT_TEMPLATE = `# CONTEXT.md - Active Projects & Recent Decisions

## Current Sprint
- **Project:** {{PROJECT_NAME}}
- **Status:** {{STATUS}}
- **Started:** {{DATE}}
- **Blockers:** None

## Recent Decisions
- {{DATE}}: {{DECISION}}

## Active Agents
{{AGENTS}}

## Open Questions
- {{QUESTION}}

## Notes
- Updated: {{TIMESTAMP}}
`;

export async function createContextMD(
  workspaceDir: string,
  projectName: string,
  decisions: string[] = []
): Promise<void> {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timestamp = now.toISOString();

  const content = CONTEXT_TEMPLATE
    .replace('{{PROJECT_NAME}}', projectName)
    .replace('{{STATUS}}', 'Active')
    .replace('{{DATE}}', dateStr)
    .replace('{{DECISION}}', decisions[0] || 'Initial setup')
    .replace('{{AGENTS}}', '- Agent swarm initialized')
    .replace('{{QUESTION}}', 'None')
    .replace('{{TIMESTAMP}}', timestamp);

  await fs.writeFile(join(workspaceDir, 'CONTEXT.md'), content);
}

export async function updateContextMD(
  workspaceDir: string,
  update: {
    decision?: string;
    status?: string;
    question?: string;
  }
): Promise<void> {
  const contextPath = join(workspaceDir, 'CONTEXT.md');
  
  try {
    let content = await fs.readFile(contextPath, 'utf-8');
    const timestamp = new Date().toISOString();
    
    if (update.decision) {
      const dateStr = timestamp.split('T')[0];
      content = content.replace(
        '## Recent Decisions',
        `## Recent Decisions\n- ${dateStr}: ${update.decision}`
      );
    }
    
    if (update.status) {
      content = content.replace(
        /Status: \w+/,
        `Status: ${update.status}`
      );
    }
    
    content = content.replace(
      /Updated: .*/,
      `Updated: ${timestamp}`
    );
    
    await fs.writeFile(contextPath, content);
  } catch {
    // File doesn't exist, create it
    await createContextMD(workspaceDir, 'Unknown', update.decision ? [update.decision] : []);
  }
}
