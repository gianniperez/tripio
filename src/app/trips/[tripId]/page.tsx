"use client";

import React, { useState } from "react";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { useTrip } from "@/features/trips/hooks";
import {
  MapPin,
  Calendar,
  Lightbulb,
  AlertTriangle,
  Loader2,
  Settings,
  Map as MapIcon,
  Wallet,
  Users,
} from "lucide-react";
import { FinanceWidget } from "@/features/finances/components/FinanceWidget";

import { InfoCard } from "@/components/ui/InfoCard";
import { QuickAccessCard } from "@/components/ui/QuickAccessCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { SettingsModal } from "@/features/trips/components";

export default function TripHome() {
  const params = useParams<{ tripId: string }>();
  const { data: trip, isLoading } = useTrip(params.tripId);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
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

  const missingDestination = !trip.destination;
  const missingDates = !trip.startDate || !trip.endDate;
  const hasMissingFields = missingDestination || missingDates;

  const proposalsUrl = `/trips/${params.tripId}/proposals`;
  const logisticsUrl = `/trips/${params.tripId}/logistics`;
  const financesUrl = `/trips/${params.tripId}/finances`;
  const participantsUrl = `/trips/${params.tripId}/participants`;

  return (
    <div className="space-y-6">
      {/* Trip Header */}
      <PageHeader
        title={trip.name}
        description={trip.destination ?? ""}
        descriptionIcon={<MapPin size={14} />}
        actionButton={{
          icon: <Settings className="w-6 h-6 text-white" />,
          onClick: () => setIsSettingsOpen(true),
          ariaLabel: "Configuración del viaje",
        }}
      />
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-text-main tracking-tight font-nunito">
            {trip.name}
          </h1>
          {trip.destination && (
            <div className="flex items-center gap-1 text-gray-500 mt-1">
              <MapPin size={14} />
              <span className="text-sm">{trip.destination}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsSettingsOpen(true)}
          className="cursor-pointer p-2 text-gray-400 hover:text-gray-600 hover:bg-black/5 rounded-xl transition-colors"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Missing Info Alert Section */}
      {hasMissingFields && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-amber-600">
            <AlertTriangle size={18} />
            <h3 className="font-bold text-sm">Información por definir</h3>
          </div>
          <p className="text-xs text-gray-500 -mt-1 ml-6">
            Usá propuestas y encuestas para que el grupo decida.
          </p>

          <div className="space-y-3">
            {missingDestination && (
              <InfoCard
                icon={<MapPin size={20} className="text-white" />}
                title="¿A dónde vamos?"
                description="El destino aún no fue definido."
                ctaLabel="Crear encuesta"
                ctaHref={proposalsUrl}
                variant="primary"
              />
            )}
            {missingDates && (
              <InfoCard
                icon={<Calendar size={20} className="text-white" />}
                title="¿Cuándo viajamos?"
                description="Las fechas del viaje no están definidas."
                ctaLabel="Sugerir fechas"
                onClick={() => setIsSettingsOpen(true)}
                variant="secondary"
              />
            )}
          </div>
        </div>
      )}

      {/* Finance Widget */}
      <FinanceWidget tripId={params.tripId} />

      {/* Quick Actions / Dashboard Cards */}
      <div className="p-2 space-y-4">
        <h3 className="font-bold text-sm text-text-main">Accesos Rápidos</h3>
        <div className="grid grid-cols-2 gap-4">
          <QuickAccessCard
            href={proposalsUrl}
            icon={<Lightbulb size={24} />}
            title="Propuestas"
            variant="primary"
          />
          <QuickAccessCard
            href={logisticsUrl}
            icon={<MapIcon size={24} />}
            title="Itinerario"
            variant="secondary"
          />
          <QuickAccessCard
            href={financesUrl}
            icon={<Wallet size={24} />}
            title="Finanzas"
            variant="secondary"
          />
          <QuickAccessCard
            href={participantsUrl}
            icon={<Users size={24} />}
            title="Participantes"
            variant="primary"
          />
        </div>
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
