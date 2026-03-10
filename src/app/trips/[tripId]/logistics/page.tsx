"use client";

import { useParams } from "next/navigation";
import { ItineraryManager } from "@/features/trips/components";

export default function TripLogistics() {
  const { tripId } = useParams<{ tripId: string }>();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-text-main tracking-tight font-nunito">
          Logística
        </h1>
        <p className="text-xs text-gray-500">
          Planificación secuencial y calendario del viaje.
        </p>
      </div>
      <ItineraryManager tripId={tripId} />
    </div>
  );
}
