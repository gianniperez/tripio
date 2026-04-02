import React from "react";
import { Icon } from "@/components/ui/Icon";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { NeumorphicActionMenu } from "@/components/neumorphic/NeumorphicActionMenu";
import { formatFirebaseDate, toDate } from "@/utils/date-utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { ProposalCardProps } from "./ProposalCard.types";
import { useParticipantById } from "@/features/participants/hooks/useParticipants";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";

interface ProposalRawData {
  location?: string;
  date?: unknown;
  startTime?: unknown;
  checkIn?: unknown;
  checkOut?: unknown;
  departure?: unknown;
  arrival?: unknown;
  isPersonal?: boolean;
  capacity?: number;
  category?: string;
  quantity?: number;
}

export const ProposalCard = ({
  proposal,
  tripId,
  currentUserUid,
  canEdit,
  canConfirm,
  canVote,
  onEdit,
  onDelete,
  onConfirm,
  onVote,
}: ProposalCardProps) => {
  const rawData = proposal.rawData as ProposalRawData;
  const { displayName: creatorName } = useParticipantById(tripId, proposal.createdBy);
  const isCreator = proposal.createdBy === currentUserUid;
  const hasEditRights = canEdit || isCreator;
  const wasEdited = proposal.updatedAt && proposal.updatedAt > proposal.createdAt;

  // Render variables for voting progress
  const yesVotesCount = Object.values(proposal.votes).filter((v) => v === "yes").length;
  const noVotesCount = Object.values(proposal.votes).filter((v) => v === "no").length;
  const totalVotes = yesVotesCount + noVotesCount;
  const yesPercentage = totalVotes === 0 ? 0 : Math.round((yesVotesCount / totalVotes) * 100);
  const userVote = proposal.votes[currentUserUid];

  const formatFirebaseTime = (d: unknown) => {
    const date = toDate(d);
    return date ? format(date, "HH:mm") : "--:--";
  };

  return (
    <NeumorphicCard className="p-6 md:p-8 flex flex-col gap-3 relative animate-in fade-in zoom-in-95 group transition-all duration-300">
      {/* Header */}

      <div className="flex justify-between items-start">
        {/* <div className="bg-secondary/20 text-secondary w-12 h-12 rounded-full flex items-center justify-center">
          <Icon name="hotel" fill />
        </div> */}
        <div className="flex gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase text-secondary`}>
                {proposal.type === "activity" && "Actividad"}
                {proposal.type === "accommodation" && "Alojamiento"}
                {proposal.type === "transport" && "Transporte"}
                {proposal.type === "inventory" && "Inventario"}
              </span>
              {wasEdited && (
                <span
                  className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full"
                  title="Propuesta editada"
                >
                  Editado
                </span>
              )}
            </div>
            <h3 className="font-bold text-main">{proposal.title}</h3>
            <span className="text-[10px] text-gray-400">
              Sugerido por {creatorName} -{" "}
              {format(proposal.createdAt, "d 'de' MMMM 'del' yyyy", { locale: es })}
            </span>
          </div>
        </div>

        <div className="flex gap-1">
          {(hasEditRights || canConfirm) && (
            <NeumorphicActionMenu
              options={[
                {
                  label: "Confirmar",
                  icon: "check_circle",
                  variant: "default",
                  onClick: () => onConfirm(proposal),
                },
                {
                  label: "Editar",
                  icon: "edit",
                  onClick: () => onEdit(proposal),
                },
                {
                  label: "Eliminar",
                  icon: "delete",
                  variant: "danger",
                  onClick: () => onDelete(proposal),
                },
              ]}
            />
          )}
        </div>
      </div>

      {/* Quick Info Line */}
      {(rawData.location || proposal.estimatedCost) && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-gray-600 dark:text-gray-400">
          {rawData.location && (
            <div className="flex items-center gap-1">
              <Icon name="location_on" size={14} className="text-gray-400" />
              <span className="line-clamp-1">{rawData.location}</span>
            </div>
          )}
          {proposal.estimatedCost && (
            <div className="flex items-center gap-1 font-bold text-accent">
              <Icon name="payments" size={14} />
              <span>${proposal.estimatedCost}</span>
            </div>
          )}
        </div>
      )}

      {/* Expanded Content */}
      <div className="flex flex-col gap-3 pt-2 animate-in slide-in-from-top-2 duration-300">
        {proposal.description && (
          <div className="bg-white dark:bg-gray-800/40 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700">
            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Notas:</span>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {proposal.description}
            </p>
          </div>
        )}

        {/* Type Specific Details */}
        <div className="grid grid-cols-2 gap-2">
          {proposal.type === "activity" && (
            <>
              {rawData.date && (
                <div className="flex flex-col p-2 bg-gray-50 dark:bg-gray-800/20 rounded-lg">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Fecha:</span>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    {formatFirebaseDate(rawData.date)}
                  </span>
                </div>
              )}
              {rawData.startTime && (
                <div className="flex flex-col p-2 bg-gray-50 dark:bg-gray-800/20 rounded-lg">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">
                    Hora de inicio:
                  </span>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    {formatFirebaseTime(rawData.startTime)}hs
                  </span>
                </div>
              )}
            </>
          )}

          {proposal.type === "accommodation" && (
            <>
              {rawData.checkIn && (
                <div className="flex flex-col p-2 bg-gray-50 dark:bg-gray-800/20 rounded-lg">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Check-in:</span>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    {formatFirebaseDate(rawData.checkIn)}
                  </span>
                </div>
              )}
              {rawData.checkOut && (
                <div className="flex flex-col p-2 bg-gray-50 dark:bg-gray-800/20 rounded-lg">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Check-out:</span>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    {formatFirebaseDate(rawData.checkOut)}
                  </span>
                </div>
              )}
            </>
          )}

          {proposal.type === "transport" && (
            <>
              {rawData.departure && (
                <div className="flex flex-col p-2 bg-gray-50 dark:bg-gray-800/20 rounded-lg">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Salida:</span>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    {formatFirebaseDate(rawData.departure)}
                  </span>
                </div>
              )}
              {rawData.arrival && (
                <div className="flex flex-col p-2 bg-gray-50 dark:bg-gray-800/20 rounded-lg">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Llegada:</span>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    {formatFirebaseDate(rawData.arrival)}
                  </span>
                </div>
              )}
              {rawData.isPersonal && (
                <div className="col-span-2 flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30">
                  <Icon name="person" size={14} className="text-blue-500" />
                  <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                    Transporte personal - Capacidad: {rawData.capacity} personas
                  </span>
                </div>
              )}
            </>
          )}

          {proposal.type === "inventory" && (
            <div className="col-span-2 flex justify-between p-2 bg-gray-50 dark:bg-gray-800/20 rounded-lg">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Categoría:</span>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 capitalize">
                  {rawData.category}
                </span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Cantidad:</span>
                <span className="text-xs font-bold text-accent">{rawData.quantity} unidades</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Voting Section */}
      <div>
        <div className="border border-gray-200 mb-4" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
            {totalVotes === 1 ? "1 voto" : `${totalVotes} votos`}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {/* Progress Bar */}
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden flex relative">
            <div
              className={`h-full transition-all duration-700 ease-out ${yesPercentage > 50 ? "bg-success" : "bg-primary-extralight"}`}
              style={{ width: `${yesPercentage}%` }}
            />
          </div>

          {/* Vote Buttons */}
          <div className="flex justify-end mt-1 gap-2">
            <button
              disabled={!canVote}
              onClick={(e) => {
                e.stopPropagation();
                onVote(proposal, "yes");
              }}
              className={`flex py-2 px-4 rounded-tripio text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                userVote === "yes"
                  ? "bg-success text-white"
                  : "bg-white text-gray-500 border border-gray-300 hover:bg-gray-100"
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
              className={`flex py-2 px-4 rounded-tripio text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                userVote === "no"
                  ? "bg-danger text-white"
                  : "bg-white text-gray-500 border border-gray-300 hover:bg-gray-100"
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
