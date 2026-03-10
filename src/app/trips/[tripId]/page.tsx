"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { useTrip } from "@/features/trips/hooks";
import {
  MapPin,
  Calendar,
  DollarSign,
  Lightbulb,
  AlertTriangle,
  Loader2,
  Settings,
  ChevronRight,
} from "lucide-react";
import { FinanceWidget } from "@/features/finances/components/FinanceWidget";

interface MissingInfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  accentColor: string;
}

function MissingInfoCard({ icon, title, description, ctaLabel, ctaHref, accentColor }: MissingInfoCardProps) {
  return (
    <Link href={ctaHref}>
      <NeumorphicCard className="p-4 flex items-center gap-4 group hover:shadow-neumorphic-sm transition-all cursor-pointer">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accentColor}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm text-text-main">{title}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-primary shrink-0">
          <span>{ctaLabel}</span>
          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </NeumorphicCard>
    </Link>
  );
}

export default function TripHome() {
  const params = useParams<{ tripId: string }>();
  const { data: trip, isLoading } = useTrip(params.tripId);

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

  return (
    <div className="space-y-6">
      {/* Trip Header */}
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
        <Link href={`/trips/${params.tripId}/settings`}>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-black/5 rounded-xl transition-colors">
            <Settings size={20} />
          </button>
        </Link>
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
              <MissingInfoCard
                icon={<MapPin size={20} className="text-white" />}
                title="¿A dónde vamos?"
                description="El destino aún no fue definido."
                ctaLabel="Crear encuesta"
                ctaHref={proposalsUrl}
                accentColor="bg-primary"
              />
            )}
            {missingDates && (
              <MissingInfoCard
                icon={<Calendar size={20} className="text-white" />}
                title="¿Cuándo viajamos?"
                description="Las fechas del viaje no están definidas."
                ctaLabel="Sugerir fechas"
                ctaHref={`/trips/${params.tripId}/settings`}
                accentColor="bg-secondary"
              />
            )}
          </div>
        </div>
      )}

      {/* Finance Widget */}
      <FinanceWidget tripId={params.tripId} />

      {/* Quick Actions / Dashboard Cards */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-text-main">Accesos Rápidos</h3>
        <div className="grid grid-cols-2 gap-3">
          <Link href={proposalsUrl}>
            <NeumorphicCard className="p-4 flex flex-col items-center gap-2 text-center hover:shadow-neumorphic-sm transition-all cursor-pointer h-full">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Lightbulb size={20} className="text-amber-600" />
              </div>
              <span className="text-xs font-semibold text-text-main">Propuestas</span>
              <span className="text-[10px] text-gray-400">Propuestas del grupo</span>
            </NeumorphicCard>
          </Link>
          <Link href={`/trips/${params.tripId}/logistics`}>
            <NeumorphicCard className="p-4 flex flex-col items-center gap-2 text-center hover:shadow-neumorphic-sm transition-all cursor-pointer h-full">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                <MapPin size={20} className="text-teal-600" />
              </div>
              <span className="text-xs font-semibold text-text-main">Itinerario</span>
              <span className="text-[10px] text-gray-400">Transporte y actividades</span>
            </NeumorphicCard>
          </Link>
        </div>
      </div>

      {/* Timeline Placeholder */}
      {!missingDates && (
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-text-main">Timeline</h3>
          <NeumorphicCard className="p-6 flex flex-col items-center gap-2 text-center">
            <Calendar size={32} className="text-gray-300" />
            <p className="text-sm text-gray-500">
              Aquí aparecerán tus actividades confirmadas.
            </p>
          </NeumorphicCard>
        </div>
      )}
    </div>
  );
}
