import { useState } from "react";
import { ProposalCard } from "../ProposalCard";
import {
  useProposals,
  useVoteProposal,
  useConfirmProposal,
  useDeleteProposal,
} from "../../hooks";
import { History, CheckCircle2, Clock, LightbulbOff } from "lucide-react";
import { Proposal } from "../../types";
import { FilterTabBar } from "@/components/ui/FilterTabBar";
import { EmptyState } from "@/components/ui/EmptyState";

interface ProposalsListProps {
  tripId: string;
  currentUserId: string;
  isAdmin: boolean;
  onEdit: (proposal: Proposal) => void;
}

type FilterTab = "pending" | "voted" | "closed";

export const ProposalsList = ({
  tripId,
  currentUserId,
  isAdmin,
  onEdit,
}: ProposalsListProps) => {
  const { data: proposals, isLoading, error } = useProposals(tripId);
  const { mutate: voteProposal } = useVoteProposal(tripId);
  const { mutate: confirmProposal } = useConfirmProposal(tripId);
  const { mutate: deleteProposal } = useDeleteProposal(tripId);

  const [activeTab, setActiveTab] = useState<FilterTab>("pending");

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        Error al cargar propuestas.
      </div>
    );
  }

  if (!proposals || proposals.length === 0) {
    return (
      <EmptyState
        title="No hay propuestas activas."
        description="¡Sé el primero en proponer una idea para el viaje!"
      />
    );
  }

  // Categorization
  const pendingProposals = proposals.filter((p) => {
    const isClosed = p.status === "confirmed" || p.status === "rejected";
    // Modified hasVoted: now considers both RSVP (votes) and specific Options (optionVotes)
    const hasVotedRsvp = p.votes && currentUserId in p.votes;
    const hasVotedOption =
      p.optionVotes &&
      Object.values(p.optionVotes).some((voters) =>
        voters.includes(currentUserId),
      );

    // For pending, we show it if the user hasn't interacted with it at all
    return !isClosed && !hasVotedRsvp && !hasVotedOption;
  });

  const votedProposals = proposals.filter((p) => {
    const isClosed = p.status === "confirmed" || p.status === "rejected";
    const hasVotedRsvp = p.votes && currentUserId in p.votes;
    const hasVotedOption =
      p.optionVotes &&
      Object.values(p.optionVotes).some((voters) =>
        voters.includes(currentUserId),
      );

    // If they voted in RSVP OR Options, it's considered "Voted"
    return !isClosed && (hasVotedRsvp || hasVotedOption);
  });

  const closedProposals = proposals.filter(
    (p) => p.status === "confirmed" || p.status === "rejected",
  );

  const filteredProposals =
    activeTab === "pending"
      ? pendingProposals
      : activeTab === "voted"
        ? votedProposals
        : closedProposals;

  const handleVote = (
    proposalId: string,
    voteType: "rsvp" | "option",
    voteValue: string,
  ) => {
    voteProposal({ proposalId, userId: currentUserId, voteType, voteValue });
  };

  const handleConfirm = (proposalId: string) => {
    if (
      confirm(
        "¿Estás seguro de confirmar esta propuesta? Pasará a formar parte del viaje.",
      )
    ) {
      confirmProposal({ proposalId, userId: currentUserId });
    }
  };

  const handleDelete = (proposalId: string) => {
    deleteProposal(proposalId);
  };

  return (
    <div className="space-y-6">
      {/* Filter Tab Bar */}
      <FilterTabBar
        tabs={[
          {
            id: "pending",
            label: "Pendientes",
            icon: <Clock />,
            count: pendingProposals.length,
          },
          {
            id: "voted",
            label: "Votadas",
            icon: <CheckCircle2 />,
            count: votedProposals.length,
          },
          {
            id: "closed",
            label: "Cerradas",
            icon: <History />,
            count: closedProposals.length,
          },
        ]}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as "pending" | "voted" | "closed")}
      />

      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {filteredProposals.length > 0 ? (
          filteredProposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onVote={(type, val) => handleVote(proposal.id, type, val)}
              onConfirm={() => handleConfirm(proposal.id)}
              onEdit={() => onEdit(proposal)}
              onDelete={() => handleDelete(proposal.id)}
            />
          ))
        ) : (
          <EmptyState
            icon={<LightbulbOff size={32} className="text-amber-500" />}
            title="Sin propuestas"
            description="No hay nada que ver por aquí en este momento."
            className="border-dashed bg-slate-50 shadow-none border border-slate-200"
          />
        )}
      </div>
    </div>
  );
};
