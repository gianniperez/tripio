import { Proposal } from "../../types";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { NeumorphicButton } from "@/components/NeumorphicButton";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  MapPin,
  Calendar,
  DollarSign,
  Check,
  ThumbsUp,
  ThumbsDown,
  UserMinus,
  Edit2,
  Trash2,
  MoreVertical,
  Info,
} from "lucide-react";
import { useState } from "react";
import { VoteType } from "../../api/voteProposal";

interface ProposalCardProps {
  proposal: Proposal;
  currentUserId: string;
  onVote: (type: VoteType, value: string) => void;
  onConfirm: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isAdmin: boolean;
}

const typeConfig = {
  accommodation: { color: "text-blue-500", label: "Alojamiento", icon: MapPin },
  transport: { color: "text-emerald-500", label: "Transporte", icon: MapPin },
  activity: { color: "text-purple-500", label: "Actividad", icon: MapPin },
  inventory: { color: "text-amber-500", label: "Item para llevar", icon: Info },
  other: { color: "text-slate-500", label: "Otro", icon: Info },
};

export const ProposalCard = ({
  proposal,
  currentUserId,
  onVote,
  onConfirm,
  onEdit,
  onDelete,
  isAdmin,
}: ProposalCardProps) => {
  const config = typeConfig[proposal.type] || typeConfig.other;
  const isConfirmed = proposal.status === "confirmed";
  const [showActions, setShowActions] = useState(false);

  const canManage = isAdmin || proposal.createdBy === currentUserId;

  const userRsvp = proposal.votes?.[currentUserId];

  const rsvpOptions = [
    {
      value: "si",
      label: "Sí",
      icon: ThumbsUp,
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500",
    },
    {
      value: "no",
      label: "No",
      icon: ThumbsDown,
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500",
    },
    {
      value: "maybe",
      label: "No me sumo",
      icon: UserMinus,
      color: "text-slate-500",
      bg: "bg-slate-500/10",
      border: "border-slate-500",
    },
  ];

  return (
    <NeumorphicCard className="mb-4 relative overflow-hidden transition-all duration-300 hover:scale-[1.01] border-l-4 border-l-primary/30">
      <div className="absolute top-2 right-2 flex items-center gap-2 z-20">
        {isConfirmed && (
          <div className="bg-success text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center">
            <Check className="w-2.5 h-2.5 mr-1" /> Confirmado
          </div>
        )}

        {canManage && !isConfirmed && (
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-full transition-all cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showActions && (
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-xl border border-slate-100 py-1 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                <button
                  onClick={() => {
                    onEdit();
                    setShowActions(false);
                  }}
                  className="w-full flex items-center px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 mr-2" /> Editar
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("¿Eliminar propuesta?")) onDelete();
                    setShowActions(false);
                  }}
                  className="w-full flex items-center px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" /> Eliminar
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

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5 text-xs text-slate-500 font-medium">
        {proposal.startDate && (
          <div className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-2 text-primary/50" />
            <span className="truncate">
              {format(proposal.startDate.toDate(), "d MMM", { locale: es })}
              {proposal.endDate &&
                ` - ${format(proposal.endDate.toDate(), "d MMM", { locale: es })}`}
            </span>
          </div>
        )}
        {proposal.location && (
          <div className="flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-2 text-primary/50" />
            <span className="truncate" title={proposal.location}>
              {proposal.location}
            </span>
          </div>
        )}
        {proposal.estimatedCost && (
          <div className="flex items-center">
            <DollarSign className="w-3.5 h-3.5 mr-2 text-green-500/50" />
            <span>
              ${proposal.estimatedCost}{" "}
              {proposal.type === "accommodation" ? "total" : "est."}
            </span>
          </div>
        )}
      </div>

      {/* RSVP Section */}
      <div className="mb-6">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block ml-1">
          ¿Te sumas?
        </label>
        <div className="flex bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50">
          {rsvpOptions.map((opt) => {
            const isActive = userRsvp === opt.value;
            const Icon = opt.icon;

            // Count RSVP votes
            const count = Object.values(proposal.votes || {}).filter(
              (v) => v === opt.value,
            ).length;

            return (
              <button
                key={opt.value}
                onClick={() => !isConfirmed && onVote("rsvp", opt.value)}
                disabled={isConfirmed}
                className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all duration-300 relative
                  ${
                    isActive
                      ? `bg-white shadow-soft ${opt.color}`
                      : "text-slate-400 hover:text-slate-600 cursor-pointer"
                  }
                  ${isConfirmed && !isActive ? "opacity-50" : ""}
                `}
              >
                <Icon
                  className={`w-4 h-4 mb-0.5 ${isActive ? opt.color : "text-slate-300"}`}
                />
                <span className="text-[10px] font-bold">{opt.label}</span>
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

      {/* Options Section (Decision specific) */}
      {proposal.options && proposal.options.length > 0 && (
        <div className="space-y-2 mb-4 pt-4 border-t border-slate-100/50">
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
                          <Check className="w-2.5 h-2.5 text-white" />
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
                      style={{ width: `${(votes / totalOptionVotes) * 100}%` }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirmation section for Admins */}
      {isAdmin && !isConfirmed && (
        <div className="pt-4 mt-2 border-t border-slate-100 flex justify-end">
          <NeumorphicButton
            variant="primary"
            onClick={onConfirm}
            className="text-[10px] py-2 px-6 font-bold uppercase tracking-widest"
          >
            Confirmar Propuesta
          </NeumorphicButton>
        </div>
      )}
    </NeumorphicCard>
  );
};
