"use client";

import {
  useProposals,
  useVoteProposal,
  useConfirmProposal,
  useDeleteProposal,
} from "@/features/proposals/hooks";
import { useParticipants } from "@/features/participants/hooks";
import { Proposal } from "@/features/proposals/types";
import { ProposalCard } from "../ProposalCard/ProposalCard";
import { Icon } from "@/components/ui/Icon";
import { EmptyState } from "@/components/ui/EmptyState";

interface ProposalsListProps {
  tripId: string;
  currentUserId: string;
  isAdmin: boolean;
  onEdit: (proposal: Proposal) => void;
  typeFilter?: string[];
  statusFilter?: string[];
  isPersonalFilter?: boolean | null;
}

const TYPE_ORDER = ["accommodation", "activity", "transport", "inventory"];

export const ProposalsList = ({
  tripId,
  currentUserId,
  isAdmin,
  onEdit,
  typeFilter,
  statusFilter,
  isPersonalFilter,
}: ProposalsListProps) => {
  const { data: proposals, isLoading } = useProposals(tripId);
  const { data: participants } = useParticipants(tripId);
  const { mutate: vote } = useVoteProposal(tripId);
  const { mutate: confirm } = useConfirmProposal(tripId);
  const { mutate: deleteProposal } = useDeleteProposal(tripId);

  // Group participants for the card
  const userProfiles = (participants || []).reduce(
    (acc, p) => ({
      ...acc,
      [p.uid]:
        (p as { displayName?: string; email?: string }).displayName ||
        (p as { displayName?: string; email?: string }).email ||
        "Usuario",
    }),
    {} as Record<string, string>,
  );

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Icon
          name="progress_activity"
          className="w-8 h-8 text-primary animate-spin"
        />
      </div>
    );
  }

  // Apply filters
  const filteredProposals = (proposals || []).filter((p) => {
    if (typeFilter && !typeFilter.includes(p.type)) return false;
    if (statusFilter && !statusFilter.includes(p.status)) return false;
    if (isPersonalFilter !== undefined) {
      if (isPersonalFilter === true) {
        return p.isPersonal === true && p.createdBy === currentUserId;
      } else if (isPersonalFilter === false) {
        return p.isPersonal !== true;
      }
    }
    return true;
  });

  if (!filteredProposals || filteredProposals.length === 0) {
    return (
      <EmptyState
        title="No hay propuestas todavía."
        description="¡Sé el primero en proponer algo!"
      />
    );
  }

  // Grouping Logic (Simplified)
  const groupedByType = filteredProposals.reduce(
    (acc, p) => {
      if (!acc[p.type]) acc[p.type] = [];
      acc[p.type].push(p);
      return acc;
    },
    {} as Record<string, Proposal[]>,
  );

  const sortedTypes = Object.keys(groupedByType).sort(
    (a, b) => TYPE_ORDER.indexOf(a) - TYPE_ORDER.indexOf(b),
  );

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      accommodation: "Alojamientos",
      activity: "Actividades",
      transport: "Transporte",
      inventory: "Inventario / Otros",
    };
    return labels[type] || type;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "accommodation":
        return <Icon name="bed" className="w-5 h-5" />;
      case "activity":
        return <Icon name="restaurant" className="w-5 h-5" />;
      case "transport":
        return <Icon name="travel" className="w-5 h-5" />;
      default:
        return <Icon name="more_vert" className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-10">
      {sortedTypes.map((type) => (
        <section
          key={type}
          className="animate-in slide-in-from-bottom-4 duration-500"
        >
          <div className="flex items-center gap-3 mb-5 ml-2">
            <div className="p-2 bg-white rounded-xl shadow-neumorphic-sm text-primary">
              {getIcon(type)}
            </div>
            <h2 className="text-lg font-bold text-slate-700 tracking-tight">
              {getTypeLabel(type)}
            </h2>
            <div className="flex-1 h-px bg-linear-to-r from-slate-200 to-transparent ml-2" />
          </div>

          <div className="space-y-6">
            {groupedByType[type].map((proposal) => (
              <div key={proposal.id} className="relative">
                <ProposalCard
                  proposal={proposal}
                  currentUserId={currentUserId}
                  onVote={(voteType, voteValue) =>
                    vote({
                      proposalId: proposal.id,
                      voteType,
                      voteValue,
                      userId: currentUserId,
                    })
                  }
                  onConfirm={(winningOption) =>
                    confirm({
                      proposalId: proposal.id,
                      userId: currentUserId,
                      winningOption,
                    })
                  }
                  onReject={() => {}}
                  onEdit={() => onEdit(proposal)}
                  onDelete={() => deleteProposal(proposal.id)}
                  isAdmin={isAdmin}
                  totalParticipants={participants?.length || 0}
                  userProfiles={userProfiles}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
