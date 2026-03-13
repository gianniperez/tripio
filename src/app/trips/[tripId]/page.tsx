"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTrip } from "@/features/trips/hooks";
import { FinanceWidget } from "@/features/finances/components/FinanceWidget";
import { InfoCard } from "@/components/ui/InfoCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { SettingsModal, ItineraryManager } from "@/features/trips/components";
import { Icon } from "@/components/ui/Icon";

export default function TripHome() {
  const params = useParams<{ tripId: string }>();
  const { data: trip, isLoading } = useTrip(params.tripId);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Icon
          name="progress_activity"
          className="w-10 h-10 text-primary animate-spin"
        />
        <p className="text-gray-500 font-medium">Cargando viaje...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">No se encontró el viaje.</p>
      </div>
    );
  }

  const missingDates = !trip.startDate || !trip.endDate;
  const hasMissingFields = missingDates;

  return (
    <div className="space-y-6">
      {/* Trip Header */}
      <PageHeader
        title={trip.name}
        actionButton={{
          icon: <Icon name="settings" className="w-6 h-6 text-white" />,
          onClick: () => setIsSettingsOpen(true),
          ariaLabel: "Configuración del viaje",
        }}
      />

      {/* Missing Info Alert Section */}
      {hasMissingFields && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-amber-600">
            <Icon name="info" className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-sm">Información por definir</h3>
          </div>
          <p className="text-xs text-gray-500 -mt-1 ml-6">
            Usá propuestas y encuestas para que el grupo decida.
          </p>

          <div>
            {missingDates && (
              <InfoCard
                icon={
                  <Icon name="calendar_month" className="w-5 h-5 text-white" />
                }
                title="¿Cuando viajamos?"
                description="Las fechas del viaje no están definidas."
                ctaLabel="Sugerir fechas"
                onClick={() => setIsSettingsOpen(true)}
                variant="secondary"
              />
            )}
          </div>
        </div>
      )}

      {/* Featured Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        {trip.enabledFeatures?.finances !== false && (
          <FinanceWidget tripId={params.tripId} />
        )}
      </div>

      {/* Itinerary Manager (Widget) */}
      <div className="pt-4 border-t border-slate-100">
        <ItineraryManager
          tripId={params.tripId}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        tripId={params.tripId}
      />
    </div>
  );
}
