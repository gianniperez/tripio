import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProposalCard } from "../ProposalCard";
import {
  useProposals,
  useVoteProposal,
  useConfirmProposal,
  useDeleteProposal,
  useRejectProposal,
} from "../../hooks";
import { History, Clock, LightbulbOff } from "lucide-react";
import { Proposal } from "../../types";
import { FilterTabBar } from "@/components/ui/FilterTabBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { useParticipants } from "@/features/participants/hooks";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const TYPE_ORDER = [
  "destination",
  "accommodation",
  "transport",
  "activity",
  "inventory",
  "other",
];

const TYPE_LABELS: Record<string, string> = {
  destination: "Destinos",
  accommodation: "Alojamientos",
  transport: "Transportes",
  activity: "Actividades",
  inventory: "Ítems para llevar",
  other: "Otros",
};

interface ProposalsListProps {
  tripId: string;
  currentUserId: string;
  isAdmin: boolean;
  onEdit: (proposal: Proposal) => void;
}

type FilterTab = "pending" | "closed";

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
  const { mutate: rejectProposal } = useRejectProposal(tripId);
  const { data: participants = [] } = useParticipants(tripId);

  const { data: userProfiles = {} } = useQuery({
    queryKey: ["users", participants.map((p) => p.uid)],
    queryFn: async () => {
      const profiles: Record<string, string> = {};
      for (const p of participants) {
        if (!p.uid) continue;
        const snap = await getDoc(doc(db, "users", p.uid));
        if (snap.exists()) {
          profiles[p.uid] = snap.data().displayName || p.uid;
        } else {
          profiles[p.uid] = p.uid;
        }
      }
      return profiles;
    },
    enabled: participants.length > 0,
  });

  const searchParams = useSearchParams();
  const scrollToProposalId = searchParams.get("proposalId");

  const [activeTab, setActiveTab] = useState<FilterTab>("pending");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Scroll to the target proposal after render
  useEffect(() => {
    if (scrollToProposalId && proposals) {
      const target = proposals.find((p) => p.id === scrollToProposalId);
      if (target) {
        const isClosed =
          target.status === "confirmed" || target.status === "rejected";
        if (
          (isClosed && activeTab !== "closed") ||
          (!isClosed && activeTab !== "pending")
        ) {
          setActiveTab(isClosed ? "closed" : "pending");
        }
        setTimeout(() => {
          const el = document.getElementById(`proposal-${scrollToProposalId}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.classList.add("ring-2", "ring-primary", "ring-offset-2");
            setTimeout(
              () =>
                el.classList.remove("ring-2", "ring-primary", "ring-offset-2"),
              2000,
            );
          }
        }, 200);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollToProposalId, proposals]);

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
  const pendingProposals = proposals.filter(
    (p) => p.status !== "confirmed" && p.status !== "rejected",
  );

  const closedProposals = proposals.filter(
    (p) => p.status === "confirmed" || p.status === "rejected",
  );

  const baseProposals =
    activeTab === "pending" ? pendingProposals : closedProposals;

  const filteredProposals =
    typeFilter === "all"
      ? baseProposals
      : baseProposals.filter((p) => p.type === typeFilter);

  const handleVote = (
    proposalId: string,
    voteType: "rsvp" | "option",
    voteValue: string,
  ) => {
    voteProposal({ proposalId, userId: currentUserId, voteType, voteValue });
  };

  const handleConfirm = (proposal: Proposal) => {
    confirmProposal({ proposalId: proposal.id, userId: currentUserId });
  };

  const handleReject = (proposalId: string) => {
    rejectProposal({ proposalId });
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
            id: "closed",
            label: "Cerradas",
            icon: <History />,
            count: closedProposals.length,
          },
        ]}
        activeTab={activeTab}
        onTabChange={(id) => {
          setActiveTab(id as FilterTab);
          setTypeFilter("all"); // Reset type filter on tab change
        }}
      />

      {/* Sub-Filter by Type */}
      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 overflow-x-auto snap-x hide-scrollbar">
        <button
          onClick={() => setTypeFilter("all")}
          className={`flex-none px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 snap-center ${
            typeFilter === "all"
              ? "bg-white text-primary shadow-soft pointer-events-none"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
          }`}
        >
          Todos
        </button>
        {TYPE_ORDER.map((type) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={`flex-none px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 snap-center whitespace-nowrap ${
              typeFilter === type
                ? "bg-white text-primary shadow-soft pointer-events-none"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            }`}
          >
            {TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {filteredProposals.length > 0 ? (
          TYPE_ORDER.map((type) => {
            const grouped = filteredProposals.filter((p) => p.type === type);
            if (grouped.length === 0) return null;

            return (
              <div key={type} className="mb-6">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 ml-2">
                  {TYPE_LABELS[type]}
                </h3>
                <div className="space-y-4">
                  {grouped.map((proposal) => (
                    <div
                      key={proposal.id}
                      id={`proposal-${proposal.id}`}
                      className="transition-all duration-300 rounded-2xl"
                    >
                      <ProposalCard
                        proposal={proposal}
                        currentUserId={currentUserId}
                        isAdmin={isAdmin}
                        onVote={(voteType, val) =>
                          handleVote(proposal.id, voteType, val)
                        }
                        onConfirm={() => handleConfirm(proposal)}
                        onReject={() => handleReject(proposal.id)}
                        onEdit={() => onEdit(proposal)}
                        onDelete={() => handleDelete(proposal.id)}
                        totalParticipants={participants.length}
                        userProfiles={userProfiles}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })
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
