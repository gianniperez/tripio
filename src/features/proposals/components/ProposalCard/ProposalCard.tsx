import { Proposal } from "../../types";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Icon } from "@/components/ui/Icon";
import { useState } from "react";
import { VoteType } from "../../api/voteProposal";
import { ConfirmDialog } from "@/components/ui/dialog/ConfirmDialog/ConfirmDialog";

interface ProposalCardProps {
  proposal: Proposal;
  currentUserId: string;
  onVote: (type: VoteType, value: string) => void;
  onConfirm: (winningOption?: string) => void;
  onReject: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddStay?: (destinationId: string) => void;
  isAdmin: boolean;
  totalParticipants: number;
  userProfiles: Record<string, string>;
}

const typeConfig = {
  accommodation: { color: "text-blue-500", label: "Alojamiento", icon: "location_on" },
  transport: { color: "text-emerald-500", label: "Transporte", icon: "location_on" },
  activity: { color: "text-purple-500", label: "Actividad", icon: "location_on" },
  inventory: { color: "text-amber-500", label: "Item para llevar", icon: "info" },
  other: { color: "text-slate-500", label: "Otro", icon: "info" },
};

export const ProposalCard = ({
  proposal,
  currentUserId,
  onVote,
  onConfirm,
  onReject,
  onEdit,
  onDelete,
  isAdmin,
  totalParticipants,
  userProfiles,
}: ProposalCardProps) => {
  const config = typeConfig[proposal.type as keyof typeof typeConfig] || typeConfig.other;
  const isConfirmed = proposal.status === "confirmed";
  const isRejected = proposal.status === "rejected";
  const isClosed = isConfirmed || isRejected;
  const [showActions, setShowActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const canManage = isAdmin || proposal.createdBy === currentUserId;

  const userRsvp = proposal.votes?.[currentUserId];

  const rsvpOptions = [
    {
      value: "si",
      label: proposal.requiresVoting ? "Sí" : "Me sumo",
      icon: "thumb_up",
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500",
    },
    {
      value: "no",
      label: proposal.requiresVoting ? "No" : "No me sumo",
      icon: "thumb_down",
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500",
    },
    ...(proposal.requiresVoting
      ? [
          {
            value: "maybe",
            label: "Tal vez",
            icon: "person_remove",
            color: "text-slate-500",
            bg: "bg-slate-500/10",
            border: "border-slate-500",
          },
        ]
      : []),
  ];

  return (
    <NeumorphicCard className="mb-4 relative overflow-hidden transition-all duration-300 hover:scale-[1.01] border-l-4 border-l-primary/30">
      <div className="absolute top-2 right-2 flex items-center gap-2 z-20">
        {isConfirmed && (
          <div className="bg-success text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center">
            <Icon name="check" className="w-2.5 h-2.5 mr-1" /> Confirmado
          </div>
        )}
        {isRejected && (
          <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center">
            <Icon name="thumb_down" className="w-2.5 h-2.5 mr-1" /> Descartada
          </div>
        )}

        {canManage && (
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-full transition-all cursor-pointer"
            >
              <Icon name="more_vert" className="w-4 h-4" />
            </button>

            {showActions && (
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-xl border border-slate-100 py-1 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                {!isConfirmed && (
                  <button
                    onClick={() => {
                      onEdit();
                      setShowActions(false);
                    }}
                    className="w-full flex items-center px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <Icon name="edit" className="w-3.5 h-3.5 mr-2" /> Editar
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowActions(false);
                    setShowDeleteConfirm(true);
                  }}
                  className="w-full flex items-center px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Icon name="delete" className="w-3.5 h-3.5 mr-2" /> Eliminar
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between items-start mb-2">
        <div>
          <span
            className={`text-[10px] font-bold uppercase tracking-widest ${config.color} mb-1 block opacity-80`}
          >
            {config.label}
          </span>
          <h3 className="text-xl font-bold font-nunito text-text-main leading-tight">
            {proposal.title}
          </h3>
        </div>
      </div>

      {proposal.description && (
        <p className="text-sm text-slate-600 mb-4 font-inter leading-relaxed">
          {proposal.description}
        </p>
      )}

      {/* Segment Badge (if available) */}
      {proposal.segmentId && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest border border-indigo-100">
            <Icon name="location_on" className="w-3 h-3" />
            Tramo asignado
          </span>
        </div>
      )}

      {/* Specific fields based on type */}
      {proposal.type === "transport" &&
        proposal.isPersonalTransport != null && (
          <div className="mb-4">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${proposal.isPersonalTransport ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-slate-50 text-slate-600 border-slate-200"}`}
            >
              {proposal.isPersonalTransport ? (
                <Icon name="directions_car" className="w-3 h-3" />
              ) : (
                <Icon name="directions_bus" className="w-3 h-3" />
              )}
              {proposal.isPersonalTransport
                ? "Transporte Personal"
                : "Transporte Público"}
              {proposal.isPersonalTransport &&
                proposal.capacity &&
                ` (Capacidad: ${proposal.capacity})`}
            </span>
          </div>
        )}

      {proposal.type === "inventory" && proposal.assignedTo && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-widest border border-amber-100">
            👤 {userProfiles[proposal.assignedTo] || proposal.assignedTo}
          </span>
        </div>
      )}

      {proposal.type === "inventory" && proposal.quantity && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-widest border border-amber-100">
            Cantidad: {proposal.quantity}
          </span>
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5 text-xs text-slate-500 font-medium">
        {proposal.startDate && (
          <div className="flex items-center">
            <Icon name="calendar_month" className="w-3.5 h-3.5 mr-2 text-primary/50" />
            <span className="truncate">
              {format(proposal.startDate.toDate(), "d MMM", { locale: es })}
              {proposal.endDate &&
                ` - ${format(proposal.endDate.toDate(), "d MMM", { locale: es })}`}
            </span>
          </div>
        )}
        {proposal.location && (
          <div className="flex items-center">
            <Icon name="location_on" className="w-3.5 h-3.5 mr-2 text-primary/50" />
            <span className="truncate" title={proposal.location}>
              {proposal.location}
            </span>
          </div>
        )}
        {proposal.estimatedCost && (
          <div className="flex items-center">
            <Icon name="attach_money" className="w-3.5 h-3.5 mr-2 text-green-500/50" />
            <span>
              ${proposal.estimatedCost}{" "}
              {proposal.type === "accommodation" ? "total" : "est."}
            </span>
          </div>
        )}
      </div>

      {/* Decision Section */}
      {(proposal.type !== "inventory" || !proposal.requiresVoting) &&
        (!proposal.responseType ||
        proposal.responseType === "rsvp" ||
        !proposal.options ||
        proposal.options.length === 0 ? (
          <div className="mb-6">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block ml-1">
              ¿Te sumas?
            </label>
            <div className="flex bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50">
              {rsvpOptions.map((opt) => {
                const isActive = userRsvp === opt.value;
                const iconName = opt.icon;

                // Count RSVP votes
                const count = Object.values(proposal.votes || {}).filter(
                  (v) => v === opt.value,
                ).length;

                const isYesOption = opt.value === "si";
                const currentYesVotes = Object.values(
                  proposal.votes || {},
                ).filter((v) => v === "si").length;
                const isPersonalTransport =
                  proposal.type === "transport" && proposal.isPersonalTransport;
                const capacityReached = Boolean(
                  isPersonalTransport &&
                  proposal.capacity &&
                  currentYesVotes >= proposal.capacity,
                );

                const isOptionDisabled = Boolean(
                  (proposal.requiresVoting && isConfirmed) || (isYesOption && capacityReached && !isActive),
                );

                return (
                  <button
                    key={opt.value}
                    onClick={() =>
                      !isOptionDisabled && onVote("rsvp", opt.value)
                    }
                    disabled={isOptionDisabled}
                    className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all duration-300 relative
                  ${
                    isActive
                      ? `bg-white shadow-soft ${opt.color}`
                      : isOptionDisabled && !isConfirmed
                        ? "text-slate-300 cursor-not-allowed bg-slate-100"
                        : "text-slate-400 hover:text-slate-600 cursor-pointer"
                  }
                  ${isConfirmed && !isActive ? "opacity-50" : ""}
                `}
                  >
                    <Icon
                      name={iconName as string}
                      className={`w-4 h-4 mb-0.5 ${isActive ? opt.color : "text-slate-300"}`}
                    />
                    <span className="text-[10px] font-bold">
                      {isYesOption && capacityReached && !isActive
                        ? "Lleno"
                        : opt.label}
                    </span>
                    {count > 0 && (
                      <span
                        className={`absolute -top-1 -right-1 text-[8px] px-1.5 py-0.5 rounded-full font-black shadow-sm
                    ${isActive ? `${opt.bg} ${opt.color}` : "bg-slate-200 text-slate-500"}
                  `}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-2 mb-4 pt-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block ml-1">
              Opciones a elegir
            </label>
            <div className="grid grid-cols-1 gap-2">
              {proposal.options.map((opt) => {
                const voters = proposal.optionVotes?.[opt] || [];
                const votes = voters.length;
                const iVotedThis = voters.includes(currentUserId);

                // Find total voters in ALL options for the bar
                const totalOptionVotes = Object.values(
                  proposal.optionVotes || {},
                ).reduce((acc, v) => acc + v.length, 0);

                return (
                  <button
                    key={opt}
                    onClick={() => !isConfirmed && onVote("option", opt)}
                    disabled={isConfirmed}
                    className={`group relative text-left px-4 py-3 rounded-2xl text-sm transition-all duration-300 border
                    ${
                      iVotedThis
                        ? "border-primary bg-primary/5 shadow-soft ring-1 ring-primary/10"
                        : "border-slate-100 bg-slate-50/20 hover:bg-white hover:border-primary/20 hover:shadow-sm cursor-pointer"
                    }
                    ${isConfirmed ? "opacity-75" : ""}
                  `}
                  >
                    <div className="flex justify-between items-center w-full relative z-10">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
                        ${iVotedThis ? "border-primary bg-primary" : "border-slate-200"}
                      `}
                        >
                          {iVotedThis && (
                            <Icon name="check" className="w-2.5 h-2.5 text-white" />
                          )}
                        </div>
                        <span
                          className={`font-medium ${iVotedThis ? "text-primary" : "text-slate-700"}`}
                        >
                          {opt}
                        </span>
                      </div>
                      {votes > 0 && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${iVotedThis ? "bg-primary text-white" : "bg-slate-200 text-slate-500"}`}
                        >
                          {votes}
                        </span>
                      )}
                    </div>
                    {/* Progress bar background */}
                    {totalOptionVotes > 0 && (
                      <div
                        className="absolute inset-y-0 left-0 bg-primary/5 transition-all duration-1000 rounded-2xl"
                        style={{
                          width: `${(votes / totalOptionVotes) * 100}%`,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

      {/* Confirmation/Rejection section for Admins */}
      {isAdmin &&
        !isClosed &&
        (() => {
          if (proposal.type === "inventory") {
            return (
              <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col items-end gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={onReject}
                    className="cursor-pointer text-[10px] py-2 px-6 font-bold uppercase tracking-widest rounded-tripio bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    Descartar
                  </button>
                  <NeumorphicButton
                    variant="primary"
                    onClick={() => onConfirm()}
                    className="text-[10px] py-2 px-6 font-bold uppercase tracking-widest"
                  >
                    Confirmar
                  </NeumorphicButton>
                </div>
              </div>
            );
          }

          // Count positive and negative RSVP votes
          const votes = proposal.votes || {};
          const positiveVotes = Object.values(votes).filter(
            (v) => v === "si",
          ).length;
          const negativeVotes = Object.values(votes).filter(
            (v) => v === "no" || v === "maybe",
          ).length;
          const totalVotes = Object.keys(votes).length;

          // For option-based proposals, count unique voters
          const optionVoterCount = new Set(
            Object.values(proposal.optionVotes || {}).flat(),
          ).size;

          const voterCount = Math.max(totalVotes, optionVoterCount);
          const requiredVotes = Math.floor(totalParticipants / 2) + 1;
          const hasEnoughVotes =
            totalParticipants > 0 && voterCount >= requiredVotes;

          // Determine outcome: positive majority = confirm, negative majority = discard
          const isPositiveMajority = positiveVotes > negativeVotes;
          // For option-based proposals (no RSVP votes), always confirm
          const isOptionBased = optionVoterCount > 0 && totalVotes === 0;

          // Logic to determine winning option for polls
          const getWinningOption = () => {
            if (proposal.responseType !== "poll" || !proposal.options) return undefined;
            
            let winner = "";
            let maxVotes = -1;
            
            proposal.options.forEach(opt => {
              const count = proposal.optionVotes?.[opt]?.length || 0;
              if (count > maxVotes) {
                maxVotes = count;
                winner = opt;
              }
            });
            
            return winner || undefined;
          };

          const handleConfirmClick = () => {
            const winner = getWinningOption();
            onConfirm(winner);
          };

          return (
            <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col items-end gap-2">
              <div className="flex items-center gap-3 text-[10px] text-slate-400">
                <span>
                  {voterCount}/{requiredVotes} votos necesarios
                </span>
                {totalVotes > 0 && (
                  <span className="flex items-center gap-1.5">
                    <span className="text-green-500 font-bold">
                      {positiveVotes} sí
                    </span>
                    <span className="text-red-500 font-bold">
                      {negativeVotes} no
                    </span>
                  </span>
                )}
              </div>
              {hasEnoughVotes && (isPositiveMajority || isOptionBased) ? (
                <NeumorphicButton
                  variant="primary"
                  onClick={handleConfirmClick}
                  className="text-[10px] py-2 px-6 font-bold uppercase tracking-widest"
                >
                  Confirmar
                </NeumorphicButton>
              ) : hasEnoughVotes && !isPositiveMajority ? (
                <button
                  onClick={onReject}
                  className="cursor-pointer text-[10px] py-2 px-6 font-bold uppercase tracking-widest rounded-tripio bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Descartar
                </button>
              ) : (
                <NeumorphicButton
                  variant="primary"
                  disabled
                  className="text-[10px] py-2 px-6 font-bold uppercase tracking-widest"
                >
                  Esperando votos
                </NeumorphicButton>
              )}
            </div>
          );
        })()}

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onDelete();
          setShowDeleteConfirm(false);
        }}
        title="Eliminar propuesta"
        message={`¿Estás seguro de eliminar "${proposal.title}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
      />
    </NeumorphicCard>
  );
};
