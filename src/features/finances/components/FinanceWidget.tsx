import React from "react";
import Link from "next/link";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { DollarSign, ChevronRight } from "lucide-react";
import { useCosts } from "@/features/finances/hooks/useCosts";
import { useEvents } from "@/features/trips/hooks";
import { useProposals } from "@/features/proposals/hooks/useProposals";
import { useAuth } from "@/features/auth/hooks";
import { useParticipants } from "@/features/participants/hooks/useParticipants";
import { calculateMyCosts } from "@/features/finances/utils/calculateCosts";
import { Participant } from "@/types/tripio";

interface FinanceWidgetProps {
  tripId: string;
}

export function FinanceWidget({ tripId }: FinanceWidgetProps) {
  const { user } = useAuth();
  const { data: costs = [], isLoading: isLoadingCosts } = useCosts(tripId);
  const { data: events = [] } = useEvents(tripId);
  const { data: proposals = [] } = useProposals(tripId);
  const { data: participants = [] } = useParticipants(tripId);

  if (!user || isLoadingCosts) {
    return (
      <NeumorphicCard className="p-4 flex items-center gap-4 animate-pulse">
        <div className="w-11 h-11 rounded-xl bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </NeumorphicCard>
    );
  }

  const currentUserParticipant = participants.find((p: Participant) => p.uid === user.uid);
  const budgetLimit = currentUserParticipant?.budgetLimit;
  const currentCost = calculateMyCosts(costs, events, proposals, user.uid);

  return (
    <Link href={`/trips/${tripId}/finances`}>
      <NeumorphicCard className="p-4 flex flex-col gap-3 group hover:shadow-neumorphic-sm transition-all cursor-pointer">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <DollarSign size={20} className="text-emerald-600" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-text-main">Mis Finanzas</h4>
              <p className="text-xs text-gray-500">
                {budgetLimit 
                  ? `Presupuesto: $${budgetLimit.toFixed(0)}` 
                  : "Sin presupuesto definido"}
              </p>
            </div>
          </div>
          <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-0.5 transition-transform" />
        </div>

        <div>
          <div className="flex justify-between items-end mb-1">
            <span className="text-2xl font-black text-text-main leading-none">
              ${currentCost.toFixed(0)}
            </span>
            {budgetLimit && (
              <span className="text-xs font-semibold text-gray-500">
                {((currentCost / budgetLimit) * 100).toFixed(0)}%
              </span>
            )}
          </div>

          {budgetLimit ? (
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden shadow-neumorphic-inset-sm">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  currentCost > budgetLimit
                    ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                    : currentCost > budgetLimit * 0.8
                    ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                    : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                }`}
                style={{ width: `${Math.min((currentCost / budgetLimit) * 100, 100)}%` }}
              />
            </div>
          ) : (
            <p className="text-[10px] text-gray-400 font-medium">Gastos proyectados de mis actividades</p>
          )}
        </div>
      </NeumorphicCard>
    </Link>
  );
}
