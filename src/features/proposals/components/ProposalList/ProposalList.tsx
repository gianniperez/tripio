import React from "react";
import { ProposalCard } from "../ProposalCard";
import type { ProposalListProps } from "./ProposalList.types";
import { EmptyState } from "@/components/ui/EmptyState";

export const ProposalList = ({
  proposals,
  currentUserUid,
  canEdit,
  canConfirm,
  canVote,
  onEdit,
  onDelete,
  onConfirm,
  onVote,
}: ProposalListProps) => {
  if (!proposals || proposals.length === 0) {
    return (
      <EmptyState
        title="Sin Propuestas"
        description="Aún no hay sugerencias en esta categoría. Usa el botón + para sumar tus ideas."
        icon="inbox"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {proposals.map((proposal) => (
        <ProposalCard
          key={proposal.id}
          proposal={proposal}
          currentUserUid={currentUserUid}
          canEdit={canEdit}
          canConfirm={canConfirm}
          canVote={canVote}
          onEdit={onEdit}
          onDelete={onDelete}
          onConfirm={onConfirm}
          onVote={onVote}
        />
      ))}
    </div>
  );
};
