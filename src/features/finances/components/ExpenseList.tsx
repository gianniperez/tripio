import React from "react";
import { Cost, Proposal } from "@/types/tripio";
import { Icon } from "@/components/ui/Icon";
import { useDeleteCost } from "../hooks/useCostMutations";
import { useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { ListItemCard } from "@/components/ui/ListItemCard";
import { useRouter } from "next/navigation";
import { formatMoney } from "../utils/formatters";

interface ExpenseListProps {
  tripId: string;
  currentUserId: string;
  costs: Cost[];
  proposals: Proposal[];
  currency: string;
}

export const ExpenseList = ({
  tripId,
  currentUserId,
  costs,
  proposals,
  currency,
}: ExpenseListProps) => {
  const deleteCost = useDeleteCost(tripId);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (costId: string) => {
    try {
      setDeletingId(costId);
      await deleteCost.mutateAsync(costId);
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
        icon="check_box"
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
          let sourceIcon = (
            <Icon name="calendar_month" className="w-6 h-6 text-primary" />
          );
          let isProposal = false;

          if (cost.linkedEventId) {
            // Unused since we don't display event names directly here
          } else if (cost.linkedProposalId) {
            const proposal = proposals.find(
              (p) => p.id === cost.linkedProposalId,
            );
            if (proposal) {
              sourceIcon = <Icon name="forum" />;
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
              onClick={
                isProposal && cost.linkedProposalId
                  ? () => router.push(`/trips/${tripId}/finances`)
                  : undefined
              }
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
                      <Icon
                        name="progress_activity"
                        className="w-4 h-4 animate-spin"
                      />
                    ) : (
                      <Icon name="delete" className="w-4 h-4" />
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
