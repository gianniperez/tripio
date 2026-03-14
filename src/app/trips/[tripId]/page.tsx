"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTrip, useSyncTripSummary } from "@/features/trips/hooks";
import { useAuth } from "@/features/auth/hooks";
import {
  DecisionHub,
  LogisticsHealth,
  CountdownWeather,
  SettingsModal,
  ItineraryManager,
} from "@/features/trips/components";
import { FinancePulse } from "@/features/finances/components";
import { InfoCard } from "@/components/ui/InfoCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Icon } from "@/components/ui/Icon";
import Link from "next/link";

export default function TripHome() {
  const params = useParams<{ tripId: string }>();
  const { data: trip, isLoading } = useTrip(params.tripId);
  const { mutate: syncSummary } = useSyncTripSummary();
  const { user } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Auto-sync if summary is missing to handle existing data
  useEffect(() => {
    if (trip && !trip.summary && params.tripId) {
      syncSummary(params.tripId);
    }
  }, [trip, params.tripId, syncSummary]);

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
    <div className="space-y-6 pb-10">
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
        <div className="pl-4 space-y-2">
          <div className="flex items-center gap-1 text-primary">
            <Icon name="info" size={22} className="text-primary" />
            <h3 className="font-bold text-sm">Información sin definir</h3>
          </div>
          <p className="text-xs text-gray-500 ml-2">
            Completa la información que falta para que el viaje esté listo o usa
            propuestas y encuestas para que el grupo decida actividades,
            alojamiento, transporte y más.
          </p>
        </div>
      )}

      {/* Strategic Dashboard Widgets */}
      <div className="space-y-4">
        {/* Row 1: Key info & Decisions */}
        <CountdownWeather startDate={trip.startDate} endDate={trip.endDate} />

        <div className="hover:scale-105 transition-all">
          <DecisionHub
            tripId={params.tripId}
            count={trip.summary?.activeProposalsCount || 0}
            categories={{
              activity: trip.summary?.proposalsByCategory?.activity || 0,
              logistics: trip.summary?.proposalsByCategory?.logistics || 0,
              inventory: trip.summary?.proposalsByCategory?.inventory || 0,
            }}
          />
        </div>

        <div className="hover:scale-105 transition-all">
          <Link href={`/trips/${params.tripId}/logistics`}>
            <LogisticsHealth
              accommodation={
                trip.summary?.logistics?.accommodation || "missing"
              }
              transport={trip.summary?.logistics?.transport || "missing"}
            />
          </Link>
        </div>

        <div className="hover:scale-105 transition-all">
          <Link href={`/trips/${params.tripId}/inventory`}>
            <InfoCard
              title="¡Todo en orden!"
              description="Todos los ítems están asignados a un responsable."
              icon="package_2"
              ctaLabel="Ver inventario"
              variant="tertiary"
              isCritical={
                trip.summary?.inventory &&
                trip.summary?.inventory?.criticalItemsCount > 0
              }
              criticalTitle={trip.summary?.inventory?.criticalItemsCount + ""}
              criticalDescription="Items sin asignar."
              criticalMessage="Asigna responsables para asegurar que nada falte!"
            />
          </Link>
        </div>

        <div className="hover:scale-105 transition-all">
          <Link href={`/trips/${params.tripId}/inventory`}>
            <FinancePulse
              totalBudget={trip.summary?.finances?.totalBudget || 0}
              totalCollected={trip.summary?.finances?.totalCollected || 0}
              totalExpenses={trip.summary?.finances?.totalExpenses || 0}
              startDate={trip.startDate}
              endDate={trip.endDate}
            />
          </Link>
        </div>
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
