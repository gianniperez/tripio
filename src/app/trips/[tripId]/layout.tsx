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
    <div className="flex bg-[--bg-color] min-h-screen relative overflow-hidden">
      <DesktopSidebar tripId={resolvedParams.tripId} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto pb-24 md:pb-12">
          <div className="w-full p-6">{children}</div>
        </main>
        <BottomBar tripId={resolvedParams.tripId} />
      </div>
    </div>
  );
}

