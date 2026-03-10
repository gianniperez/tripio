import { useState } from "react";
import { ProposalCard } from "../ProposalCard";
import {
  useProposals,
  useVoteProposal,
  useConfirmProposal,
  useDeleteProposal,
} from "../../hooks";
import { History, CheckCircle2, Clock } from "lucide-react";
import { Proposal } from "../../types";

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
      <div className="text-center p-8 text-slate-500 font-inter">
        <p>No hay propuestas activas.</p>
        <p className="text-sm mt-2">
          ¡Sé el primero en proponer una idea para el viaje!
        </p>
      </div>
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
      <div className="bg-slate-100 flex p-2 rounded-tripio sticky top-20 z-10 backdrop-blur-sm border border-white/20">
        <button
          onClick={() => setActiveTab("pending")}
          className={`cursor-pointer flex-1 flex items-center justify-center py-2.5 px-2 rounded-tripio text-xs font-bold transition-all ${
            activeTab === "pending"
              ? "bg-white text-primary shadow-soft"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Clock className="w-3.5 h-3.5 mr-1.5" />
          Pendientes ({pendingProposals.length})
        </button>
        <button
          onClick={() => setActiveTab("voted")}
          className={`cursor-pointer flex-1 flex items-center justify-center py-2.5 px-2 rounded-tripio text-xs font-bold transition-all ${
            activeTab === "voted"
              ? "bg-white text-primary shadow-soft"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
          Votadas ({votedProposals.length})
        </button>
        <button
          onClick={() => setActiveTab("closed")}
          className={`cursor-pointer flex-1 flex items-center justify-center py-2.5 px-2 rounded-tripio text-xs font-bold transition-all ${
            activeTab === "closed"
              ? "bg-white text-primary shadow-soft"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <History className="w-3.5 h-3.5 mr-1.5" />
          Cerradas ({closedProposals.length})
        </button>
      </div>

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
          <div className="text-center py-12 px-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400 font-medium text-sm">
              No hay nada que ver por aquí en este momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
