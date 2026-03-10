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
import { EmptyState } from "@/components/ui/EmptyState";
import { ListItemCard } from "@/components/ui/ListItemCard";

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
      <EmptyState
        title="No tienes gastos proyectados"
        description="Los gastos asociados a tus actividades confirmadas aparecerán aquí."
        icon={<CheckSquare className="w-6 h-6 text-amber-500" />}
      />
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
          let sourceIcon = <Calendar className="w-6 h-6 text-primary" />;
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
              sourceIcon = <MessageSquare />;
              isProposal = true;
            }
          }

          return (
            <ListItemCard
              key={cost.id}
              icon={sourceIcon}
              title={cost.description}
              description={cost.category}
              rightDetail={formatMoney(cost.amount, currency)}
              actions={
                !isProposal &&
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
                )
              }
              className="active:scale-[0.98]"
            />
          );
        })}
      </div>
    </div>
  );
};
