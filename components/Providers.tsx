'use client';

import { AgentProvider } from '@/lib/agent-context';
import { ProjectProvider } from '@/lib/project-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AgentProvider>
      <ProjectProvider>
        {children}
      </ProjectProvider>
    </AgentProvider>
  );
}
