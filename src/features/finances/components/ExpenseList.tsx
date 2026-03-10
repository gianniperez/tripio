import React from "react";
import { Cost, Event, Proposal } from "@/types/tripio";
import {
  Calendar,
  CheckSquare,
  MessageSquare,
  Trash2,
  Loader2,
} from "lucide-react";
import { useDeleteCost } from "../hooks/useCostMutations";
import { useState } from "react";

interface ExpenseListProps {
  tripId: string;
  currentUserId: string;
  costs: Cost[];
  events: Event[];
  proposals: Proposal[];
  currency: string;
}

const formatMoney = (amount: number, currency: string) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const ExpenseList = ({
  tripId,
  currentUserId,
  costs,
  events,
  proposals,
  currency,
}: ExpenseListProps) => {
  const deleteCost = useDeleteCost();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (costId: string) => {
    try {
      setDeletingId(costId);
      await deleteCost.mutateAsync({ tripId, costId });
    } catch (error) {
      console.error("Error deleting cost:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (costs.length === 0) {
    return (
      <div className="bg-white rounded-tripio p-8 shadow-neumorphic text-center flex flex-col items-center justify-center gap-3 mt-4">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shadow-neumorphic-inset">
          <CheckSquare className="w-6 h-6 text-gray-400" />
        </div>
        <div>
          <p className="text-gray-600 font-bold mb-1">
            No tienes gastos proyectados
          </p>
          <p className="text-gray-400 text-sm leading-tight max-w-[200px] mx-auto">
            Los gastos asociados a tus actividades confirmadas aparecerán aquí.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-bold text-gray-700 font-nunito tracking-tight px-1 text-lg">
        Tus Gastos Proyectados
      </h3>
      <div className="bg-white flex flex-col gap-3">
        {costs.map((cost) => {
          let sourceName = "Actividad Desconocida";
          let sourceIcon = <Calendar className="w-4 h-4 text-primary" />;
          let isProposal = false;

          if (cost.linkedEventId) {
            const event = events.find((e) => e.id === cost.linkedEventId);
            if (event) sourceName = event.title;
          } else if (cost.linkedProposalId) {
            const proposal = proposals.find(
              (p) => p.id === cost.linkedProposalId,
            );
            if (proposal) {
              sourceName = proposal.title;
              sourceIcon = <MessageSquare className="w-4 h-4 text-secondary" />;
              isProposal = true;
            }
          }

          return (
            <div
              key={cost.id}
              className="bg-surface rounded-xl p-4 shadow-neumorphic flex items-center justify-between transition-transform active:scale-[0.98]"
            >
              <div className="flex items-start gap-3 overflow-hidden">
                <div
                  className={`mt-0.5 p-2 rounded-lg shrink-0 ${isProposal ? "bg-secondary/10" : "bg-primary/10"}`}
                >
                  {sourceIcon}
                </div>
                <div className="min-w-0 pr-2">
                  <p className="font-bold text-gray-700 leading-tight truncate">
                    {cost.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5 font-medium truncate">
                    <span className="truncate">{sourceName}</span>
                    {isProposal && (
                      <span className="bg-secondary/10 text-secondary px-1.5 rounded-sm text-[10px] font-bold shrink-0">
                        Propuesta
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="text-right flex items-center justify-end gap-3 ml-2 shrink-0">
                <p className="font-black text-text-main font-nunito tracking-tighter text-lg">
                  {formatMoney(cost.amount, currency)}
                </p>
                {!isProposal &&
                  !cost.linkedEventId &&
                  cost.createdBy === currentUserId && (
                    <button
                      onClick={() => handleDelete(cost.id)}
                      disabled={deletingId === cost.id}
                      className="cursor-pointer p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {deletingId === cost.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
