import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Welcome to Clawncil</h1>
          <p>Select an agent or room from the sidebar to start</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
