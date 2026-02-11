import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clawncil - Agent Swarm Command Center",
  description: "Real-time agent orchestration platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
