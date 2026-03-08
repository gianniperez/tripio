import React, { ReactNode } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { BottomBar } from "@/components/layout/BottomBar";

export default function TripLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ tripId: string }>;
}) {
  const resolvedParams = React.use(params);

  return (
    <div className="flex flex-col h-screen bg-[--bg-color] max-w-md mx-auto relative overflow-hidden shadow-2xl">
      <TopBar />
      <main className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto pb-20">
        <div className="mx-auto w-full p-6">{children}</div>
      </main>
      <BottomBar tripId={resolvedParams.tripId} />
    </div>
  );
}
