"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ItineraryManager, SettingsModal } from "@/features/trips/components";
import { PageHeader } from "@/components/ui/PageHeader";

export default function TripLogistics() {
  const { tripId } = useParams<{ tripId: string }>();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Logística"
        description="Planificación secuencial y calendario del viaje."
      />
      <ItineraryManager
        tripId={tripId}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        tripId={tripId}
      />
    </div>
  );
}
