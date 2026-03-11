"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useProposals } from "@/features/proposals/hooks";
import { PageHeader } from "@/components/ui/PageHeader";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { MapPin, Plane, Package, Loader2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Proposal } from "@/features/proposals/types";
import { useRouter } from "next/navigation";

export default function TripLogistics() {
  const { tripId } = useParams<{ tripId: string }>();
  const router = useRouter();
  const { data: proposals, isLoading: loading } = useProposals(tripId);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-gray-500 font-medium">Cargando logística...</p>
      </div>
    );
  }

  // Filtrar propuestas confirmadas por tipo
  const confirmedProposals =
    proposals?.filter((p) => p.status === "confirmed") || [];

  const accommodations = confirmedProposals.filter(
    (p) => p.type === "accommodation",
  );
  const transports = confirmedProposals.filter((p) => p.type === "transport");
  const inventory = confirmedProposals.filter((p) => p.type === "inventory");
  const destinations = confirmedProposals.filter(
    (p) => p.type === "destination",
  );

  const renderEmptyState = (message: string, proposalType: string) => (
    <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3">
      <p className="text-sm text-slate-400 font-medium">{message}</p>
      <Link
        href={`/trips/${tripId}/proposals?type=${proposalType}&open=true`}
        className="text-xs font-bold text-primary bg-primary/10 px-4 py-2 rounded-xl hover:bg-primary/20 transition-colors"
      >
        Crear propuesta
      </Link>
    </div>
  );

  const renderAccommodationCard = (item: Proposal) => (
    <NeumorphicCard
      key={item.id}
      onClick={() =>
        router.push(`/trips/${tripId}/proposals?proposalId=${item.id}`)
      }
      className="mb-4 relative border-l-4 border-l-blue-500/50 cursor-pointer hover:shadow-neumorphic-sm transition-all"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold font-nunito text-text-main leading-tight">
            {item.title}
          </h3>
          {item.location && (
            <p className="text-xs text-slate-500 flex items-center mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              {item.location}
            </p>
          )}
        </div>
        <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
          <MapPin className="w-5 h-5" />
        </div>
      </div>
      {(item.startDate || item.endDate) && (
        <div className="mt-3 bg-slate-50/50 rounded-xl p-3 flex gap-4 text-xs font-medium text-slate-600 border border-slate-100">
          {item.startDate && (
            <div>
              <span className="text-slate-400 block mb-0.5">Check-in</span>
              {format(item.startDate.toDate(), "d MMM, yy", { locale: es })}
            </div>
          )}
          {item.endDate && (
            <div>
              <span className="text-slate-400 block mb-0.5">Check-out</span>
              {format(item.endDate.toDate(), "d MMM, yy", { locale: es })}
            </div>
          )}
        </div>
      )}
    </NeumorphicCard>
  );

  const renderTransportCard = (item: Proposal) => (
    <NeumorphicCard
      key={item.id}
      onClick={() =>
        router.push(`/trips/${tripId}/proposals?proposalId=${item.id}`)
      }
      className="mb-4 relative border-l-4 border-l-emerald-500/50 cursor-pointer hover:shadow-neumorphic-sm transition-all"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold font-nunito text-text-main leading-tight">
            {item.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 capitalize">
            {item.isPersonalTransport
              ? "Transporte Personal"
              : "Transporte Público"}
          </p>
        </div>
        <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl">
          <Plane className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3 bg-slate-50/50 rounded-xl p-3 flex gap-4 text-xs font-medium text-slate-600 border border-slate-100">
        {item.startDate && (
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            {format(item.startDate.toDate(), "d MMM - HH:mm", { locale: es })}
          </div>
        )}
      </div>
    </NeumorphicCard>
  );

  const renderInventoryCard = (item: Proposal) => (
    <NeumorphicCard
      key={item.id}
      onClick={() =>
        router.push(`/trips/${tripId}/proposals?proposalId=${item.id}`)
      }
      className="mb-4 relative border-l-4 border-l-amber-500/50 cursor-pointer hover:shadow-neumorphic-sm transition-all"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold font-nunito text-text-main leading-tight">
            {item.title}
          </h3>
          {item.description && (
            <p className="text-xs text-slate-500 mt-1">{item.description}</p>
          )}
        </div>
        <div className="flex flex-col items-end">
          <div className="bg-amber-100 text-amber-600 p-2 rounded-xl mb-2">
            <Package className="w-5 h-5" />
          </div>
          {item.quantity && (
            <span className="text-xs font-bold text-slate-600 px-2 flex gap-1 items-center bg-slate-100 rounded-lg">
              x{item.quantity}
            </span>
          )}
        </div>
      </div>
    </NeumorphicCard>
  );

  const renderDestinationCard = (item: Proposal) => (
    <NeumorphicCard
      key={item.id}
      onClick={() =>
        router.push(`/trips/${tripId}/proposals?proposalId=${item.id}`)
      }
      className="mb-4 relative border-l-4 border-l-rose-500/50 cursor-pointer hover:shadow-neumorphic-sm transition-all"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold font-nunito text-text-main leading-tight">
            {item.title}
          </h3>
          {item.location && (
            <p className="text-xs text-slate-500 flex items-center mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              {item.location}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end">
          <div className="bg-rose-100 text-rose-600 p-2 rounded-xl mb-2">
            <MapPin className="w-5 h-5" />
          </div>
        </div>
      </div>
    </NeumorphicCard>
  );

  return (
    <div className="space-y-8 pb-20">
      <PageHeader
        title="Logística"
        description="Gestión de destinos, alojamientos, transportes e inventario."
      />

      {/* DESTINATIONS SECTION */}
      <section>
        <div className="flex items-center gap-2 mb-4 px-2">
          <div className="bg-rose-500 text-white p-1.5 rounded-lg shadow-sm">
            <MapPin className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-slate-700">Destinos</h2>
        </div>
        <div className="space-y-3">
          {destinations.length > 0
            ? destinations.map(renderDestinationCard)
            : renderEmptyState(
                "No hay destinos confirmados aún.",
                "destination",
              )}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4 px-2">
          <div className="bg-blue-500 text-white p-1.5 rounded-lg shadow-sm">
            <MapPin className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-slate-700">Alojamientos</h2>
        </div>
        <div className="space-y-3">
          {accommodations.length > 0
            ? accommodations.map(renderAccommodationCard)
            : renderEmptyState(
                "No hay alojamientos confirmados aún.",
                "accommodation",
              )}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4 px-2">
          <div className="bg-emerald-500 text-white p-1.5 rounded-lg shadow-sm">
            <Plane className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-slate-700">Transportes</h2>
        </div>
        <div className="space-y-3">
          {transports.length > 0
            ? transports.map(renderTransportCard)
            : renderEmptyState(
                "No hay transportes confirmados aún.",
                "transport",
              )}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4 px-2">
          <div className="bg-amber-500 text-white p-1.5 rounded-lg shadow-sm">
            <Package className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-slate-700">Inventario</h2>
        </div>
        <div className="space-y-3">
          {inventory.length > 0
            ? inventory.map(renderInventoryCard)
            : renderEmptyState(
                "No hay items de inventario confirmados aún.",
                "inventory",
              )}
        </div>
      </section>
    </div>
  );
}
