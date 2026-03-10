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

  const currentUserParticipant = participants.find(
    (p: Participant) => p.uid === user.uid,
  );
  const budgetLimit = currentUserParticipant?.budgetLimit;
  const currentCost = calculateMyCosts(costs, events, proposals, user.uid);

  return (
    <Link href={`/trips/${tripId}/finances`}>
      <NeumorphicCard className="my-6 p-5 flex flex-col gap-4 group hover:shadow-xl transition-all cursor-pointer glass-card border-l-4 border-l-primary/50">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary shadow-lg shadow-primary/30 flex items-center justify-center shrink-0">
              <DollarSign size={24} className="text-white" />
            </div>
            <div>
              <h4 className="font-black text-base text-secondary-deep tracking-tight">
                Mis Finanzas
              </h4>
              <p className="text-xs font-bold text-secondary">
                {budgetLimit
                  ? `Presupuesto: $${budgetLimit.toFixed(0)}`
                  : "Gastos proyectados"}
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-secondary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <ChevronRight
              size={18}
              className="text-secondary group-hover:text-primary group-hover:translate-x-0.5 transition-all"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-3xl font-black text-secondary-deep leading-none tracking-tighter">
              ${currentCost.toFixed(0)}
            </span>
            {budgetLimit && (
              <div className="flex flex-col items-end">
                <span
                  className={`text-xs font-black px-2 py-0.5 rounded-full ${
                    currentCost > budgetLimit
                      ? "bg-red-100 text-red-600"
                      : "bg-secondary-light text-secondary"
                  }`}
                >
                  {((currentCost / budgetLimit) * 100).toFixed(0)}%
                </span>
              </div>
            )}
          </div>

          <div className="h-3 w-full bg-secondary/5 rounded-full overflow-hidden p-0.5 border border-secondary/10 shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out shadow-sm ${
                budgetLimit && currentCost > budgetLimit
                  ? "bg-red-500"
                  : budgetLimit && currentCost > budgetLimit * 0.8
                    ? "bg-primary-light"
                    : "bg-secondary"
              }`}
              style={{
                width: `${budgetLimit ? Math.min((currentCost / budgetLimit) * 100, 100) : 100}%`,
              }}
            />
          </div>

          {!budgetLimit && (
            <p className="text-[10px] text-secondary/60 font-bold uppercase tracking-wider">
              Análisis de costos basado en actividades
            </p>
          )}
        </div>
      </NeumorphicCard>
    </Link>
  );
}
