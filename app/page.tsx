'use client';

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { useAgentContext } from "@/lib/agent-context";

export default function Home() {
  const { selectedAgent } = useAgentContext();

  return (
    <DashboardLayout>
      {selectedAgent ? (
        <ChatPanel />
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-2">Welcome to Clawncil</h1>
            <p>Select an agent from the sidebar to start a conversation</p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
