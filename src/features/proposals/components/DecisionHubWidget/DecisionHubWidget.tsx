"use client";

import { UnifiedProposal } from "../../api/proposalsService";
import Link from "next/link";
import { useMemo } from "react";

interface DecisionHubWidgetProps {
  proposals: UnifiedProposal[];
  tripId: string;
}

export function DecisionHubWidget({ proposals, tripId }: DecisionHubWidgetProps) {
  const counts = useMemo(() => {
    return {
      activity: proposals.filter((p) => p.type === "activity").length,
      accommodation: proposals.filter((p) => p.type === "accommodation").length,
      transport: proposals.filter((p) => p.type === "transport").length,
      inventory: proposals.filter((p) => p.type === "inventory").length,
    };
  }, [proposals]);

  const total = proposals.length;
  const isPlural = total !== 1;

  if (total === 0) return null;

  return (
    <Link
      href={`/trips/${tripId}/proposals`}
      className="block w-full transition-all duration-300 hover:scale-[1.02] outline-none"
    >
      <div className="bg-primary rounded-[32px] p-5 sm:p-6 shadow-cream relative overflow-hidden group">
        {/* Header */}
        <div className="mb-6 relative z-10">
          <h2 className="text-white text-lg font-display font-bold leading-tight">
            Centro de Decisiones
          </h2>
          <p className="text-white/80 text-sm font-inter">
            Hay {total} {isPlural ? "propuestas pendientes" : "propuesta pendiente"}!
          </p>
        </div>

        {/* Grid de Contadores */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 relative z-10">
          <CounterBox count={counts.activity} label="ACTIVIDADES" />
          <CounterBox count={counts.accommodation} label="ALOJAMIENTOS" />
          <CounterBox count={counts.transport} label="TRANSPORTES" />
          <CounterBox count={counts.inventory} label="INVENTARIO" />
        </div>
      </div>
    </Link>
  );
}

function CounterBox({ count, label }: { count: number; label: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex flex-col items-center justify-center border border-white/10 transition-colors group-hover:bg-white/20">
      <span className="text-white font-display font-black leading-none mb-1">{count}</span>
      <span className="text-white/60 text-[8px] font-bold tracking-wider uppercase text-center">
        {label}
      </span>
    </div>
  );
}
