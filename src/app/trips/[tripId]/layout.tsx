import React, { ReactNode } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { BottomBar } from "@/components/layout/BottomBar";
import { DesktopSidebar } from "@/components/layout/DesktopSidebar";

export default function TripLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ tripId: string }>;
}) {
  const resolvedParams = React.use(params);

  return (
    <div className="flex flex-col h-screen bg-[--bg-color]">
      <TopBar />
      <div className="flex flex-1 overflow-hidden relative">
        <DesktopSidebar tripId={resolvedParams.tripId} />
        <main className="flex-1 overflow-y-auto w-full pb-24 md:pb-12">
          <div className="max-w-4xl mx-auto p-6">{children}</div>
        </main>
        <BottomBar tripId={resolvedParams.tripId} />
      </div>
    </div>
  );
}
