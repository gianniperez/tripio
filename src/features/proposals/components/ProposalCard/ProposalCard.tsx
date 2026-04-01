import React from "react";
import { Icon } from "@/components/ui/Icon";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { formatFirebaseDate, toDate } from "@/utils/date-utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { ProposalCardProps } from "./ProposalCard.types";

const typeConfig = {
  activity: {
    icon: "local_activity",
    color: "text-orange-500",
    bg: "bg-orange-100",
    label: "Actividad",
  },
  accommodation: { icon: "hotel", color: "text-blue-500", bg: "bg-blue-100", label: "Alojamiento" },
  transport: {
    icon: "directions_car",
    color: "text-green-500",
    bg: "bg-green-100",
    label: "Transporte",
  },
  inventory: {
    icon: "inventory_2",
    color: "text-purple-500",
    bg: "bg-purple-100",
    label: "Inventario",
  },
};

export const ProposalCard = ({
  proposal,
  currentUserUid,
  canEdit,
  canConfirm,
  canVote,
  onEdit,
  onDelete,
  onConfirm,
  onVote,
}: ProposalCardProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const config = typeConfig[proposal.type];
  const isCreator = proposal.createdBy === currentUserUid;
  const hasEditRights = canEdit || isCreator;
  const wasEdited = proposal.updatedAt && proposal.updatedAt > proposal.createdAt;

  // Render variables for voting progress
  const yesVotesCount = Object.values(proposal.votes).filter((v) => v === "yes").length;
  const noVotesCount = Object.values(proposal.votes).filter((v) => v === "no").length;
  const totalVotes = yesVotesCount + noVotesCount;
  const yesPercentage = totalVotes === 0 ? 0 : Math.round((yesVotesCount / totalVotes) * 100);
  const userVote = proposal.votes[currentUserUid];

  const formatFirebaseTime = (d: any) => {
    const date = toDate(d);
    return date ? format(date, "HH:mm") : "--:--";
  };

  return (
    <NeumorphicCard className="p-4 flex flex-col gap-3 relative animate-in fade-in zoom-in-95 group transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bg} ${config.color} shadow-sm shrink-0`}
          >
            <Icon name={config.icon} size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${config.color}`}>
                {config.label}
              </span>
              {wasEdited && (
                <span
                  className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-full"
                  title="Propuesta editada"
                >
                  Editado
                </span>
              )}
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 leading-tight line-clamp-1">
              {proposal.title}
            </h3>
            <span className="text-[10px] text-slate-400">
              Sugerido {format(proposal.createdAt, "d MMM", { locale: es })}
            </span>
          </div>
        </div>

        <div className="flex gap-1">
          {hasEditRights && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(proposal);
                }}
                className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors cursor-pointer rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20"
                title="Editar"
              >
                <Icon name="edit" size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(proposal);
                }}
                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                title="Eliminar"
              >
                <Icon name="delete" size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Quick Info Line */}
      {(proposal.rawData?.location || proposal.rawData?.priceEstimate) && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-slate-600 dark:text-slate-400">
          {proposal.rawData?.location && (
            <div className="flex items-center gap-1">
              <Icon name="location_on" size={14} className="text-slate-400" />
              <span className="line-clamp-1">{proposal.rawData.location}</span>
            </div>
          )}
          {proposal.rawData?.priceEstimate && (
            <div className="flex items-center gap-1 font-bold text-accent">
              <Icon name="payments" size={14} />
              <span>${proposal.rawData.priceEstimate}</span>
            </div>
          )}
        </div>
      )}

      {/* Description Preview (if not expanded) */}
      {!isExpanded && proposal.description && (
        <p className="text-xs text-slate-500 line-clamp-2 mt-1 italic">
          &quot;{proposal.description}&quot;
        </p>
      )}

      {/* Expand Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-center gap-1 w-full py-1 text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-slate-50 dark:bg-slate-800/30 rounded-lg mt-1"
      >
        <Icon name={isExpanded ? "expand_less" : "expand_more"} size={16} />
        {isExpanded ? "VER MENOS" : "VER DETALLES"}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="flex flex-col gap-3 pt-2 animate-in slide-in-from-top-2 duration-300">
          {proposal.description && (
            <div className="bg-white dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                Notas:
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {proposal.description}
              </p>
            </div>
          )}

          {/* Type Specific Details */}
          <div className="grid grid-cols-2 gap-2">
            {proposal.type === "activity" && (
              <>
                {proposal.rawData?.date && (
                  <div className="flex flex-col p-2 bg-slate-50 dark:bg-slate-800/20 rounded-lg">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Fecha:</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {formatFirebaseDate(proposal.rawData.date)}
                    </span>
                  </div>
                )}
                {proposal.rawData?.startTime && (
                  <div className="flex flex-col p-2 bg-slate-50 dark:bg-slate-800/20 rounded-lg">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">
                      Hora de inicio:
                    </span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {formatFirebaseTime(proposal.rawData.startTime)}hs
                    </span>
                  </div>
                )}
              </>
            )}

            {proposal.type === "accommodation" && (
              <>
                {proposal.rawData?.checkIn && (
                  <div className="flex flex-col p-2 bg-slate-50 dark:bg-slate-800/20 rounded-lg">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Check-in:</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {formatFirebaseDate(proposal.rawData.checkIn)}
                    </span>
                  </div>
                )}
                {proposal.rawData?.checkOut && (
                  <div className="flex flex-col p-2 bg-slate-50 dark:bg-slate-800/20 rounded-lg">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">
                      Check-out:
                    </span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {formatFirebaseDate(proposal.rawData.checkOut)}
                    </span>
                  </div>
                )}
              </>
            )}

            {proposal.type === "transport" && (
              <>
                {proposal.rawData?.departure && (
                  <div className="flex flex-col p-2 bg-slate-50 dark:bg-slate-800/20 rounded-lg">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Salida:</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {formatFirebaseDate(proposal.rawData.departure)}
                    </span>
                  </div>
                )}
                {proposal.rawData?.arrival && (
                  <div className="flex flex-col p-2 bg-slate-50 dark:bg-slate-800/20 rounded-lg">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Llegada:</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {formatFirebaseDate(proposal.rawData.arrival)}
                    </span>
                  </div>
                )}
                {proposal.rawData?.isPersonal && (
                  <div className="col-span-2 flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30">
                    <Icon name="person" size={14} className="text-blue-500" />
                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                      Transporte personal - Capacidad: {proposal.rawData.capacity} personas
                    </span>
                  </div>
                )}
              </>
            )}

            {proposal.type === "inventory" && (
              <div className="col-span-2 flex justify-between p-2 bg-slate-50 dark:bg-slate-800/20 rounded-lg">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Categoría:</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 capitalize">
                    {proposal.rawData?.category}
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Cantidad:</span>
                  <span className="text-xs font-bold text-accent">
                    {proposal.rawData?.quantity} unidades
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Voting Section */}
      <div className="bg-slate-50/50 dark:bg-slate-800/30 p-3 rounded-xl border border-white/50 dark:border-slate-700/50 shadow-inner mt-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
            Decisión Grupal ({totalVotes} votos)
          </span>
          {canConfirm && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onConfirm(proposal);
              }}
              className="text-[10px] font-bold bg-green-500 hover:bg-green-600 text-white px-2.5 py-1 rounded-full transition shadow-sm cursor-pointer flex items-center gap-1 active:scale-95"
            >
              <Icon name="check_circle" size={12} />
              CONFIRMAR
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {/* Progress Bar */}
          <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex relative">
            <div
              className={`h-full transition-all duration-700 ease-out ${yesPercentage > 50 ? "bg-green-500" : "bg-orange-400"}`}
              style={{ width: `${yesPercentage}%` }}
            />
          </div>

          {/* Vote Buttons */}
          <div className="flex justify-between mt-1 gap-2">
            <button
              disabled={!canVote}
              onClick={(e) => {
                e.stopPropagation();
                onVote(proposal, "yes");
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                userVote === "yes"
                  ? "bg-green-500 text-white shadow-md scale-105"
                  : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              <Icon name="thumb_up" size={14} />
              Sí ({yesVotesCount})
            </button>
            <button
              disabled={!canVote}
              onClick={(e) => {
                e.stopPropagation();
                onVote(proposal, "no");
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                userVote === "no"
                  ? "bg-red-500 text-white shadow-md scale-105"
                  : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              <Icon name="thumb_down" size={14} />
              No ({noVotesCount})
            </button>
          </div>
        </div>
      </div>
    </NeumorphicCard>
  );
};
