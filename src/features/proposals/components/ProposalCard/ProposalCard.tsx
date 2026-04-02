import React from "react";
import { Icon } from "@/components/ui/Icon";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { NeumorphicActionMenu } from "@/components/neumorphic/NeumorphicActionMenu";
import { formatFirebaseDate } from "@/utils/date-utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { ProposalCardProps } from "./ProposalCard.types";
import { useParticipantById } from "@/features/participants/hooks/useParticipants";
import type { ProposalType } from "@/features/proposals/api/proposalsService";
import { useTripCurrency } from "@/features/trips/hooks/useTripCurrency";

const PROPOSAL_TYPE_CONFIG: Record<ProposalType, { label: string; icon: string; color: string }> = {
  activity: {
    label: "Actividad",
    icon: "local_activity",
    color: "primary",
  },
  accommodation: {
    label: "Alojamiento",
    icon: "hotel",
    color: "primary-extralight",
  },
  transport: {
    label: "Transporte",
    icon: "directions_car",
    color: "secondary",
  },
  inventory: {
    label: "Inventario",
    icon: "inventory_2",
    color: "accent",
  },
};

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
  const currency = useTripCurrency(tripId);
  const isCreator = proposal.createdBy === currentUserUid;
  const hasEditRights = canEdit || isCreator;
  const wasEdited = proposal.updatedAt && proposal.updatedAt > proposal.createdAt;

  const config = PROPOSAL_TYPE_CONFIG[proposal.type];

  // Render variables for voting progress
  const yesVotesCount = Object.values(proposal.votes).filter((v) => v === "yes").length;
  const noVotesCount = Object.values(proposal.votes).filter((v) => v === "no").length;
  const totalVotes = yesVotesCount + noVotesCount;
  const yesPercentage = totalVotes === 0 ? 0 : Math.round((yesVotesCount / totalVotes) * 100);
  const userVote = proposal.votes[currentUserUid];

  return (
    <NeumorphicCard className="p-5 md:p-8 flex flex-col gap-3 relative animate-in fade-in zoom-in-95 group transition-all duration-300">
      {/* Header */}

      <div className="flex justify-between items-start">
        <div className="flex gap-3 items-center">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 text-white bg-${config.color} shadow-sm border border-white/50 dark:border-gray-700/50`}
          >
            <Icon name={config.icon} fill size={24} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase text-${config.color}`}>
                {config.label}
              </span>
              {wasEdited && (
                <span
                  className="text-[10px] font-medium bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full"
                  title="Propuesta editada"
                >
                  Editado
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <h3 className="font-bold text-main">{proposal.title}</h3>
              {rawData.quantity && rawData.quantity !== 1 && (
                <span className="text-xs text-gray-400">({rawData.quantity})</span>
              )}
              {rawData.capacity && (
                <span className="text-xs text-gray-400">({rawData.capacity} personas)</span>
              )}
            </div>
            {/* {rawData.location && (
              <div className="flex items-center gap-0.5 text-xs text-gray-400 mb-1">
                <Icon name="location_on" size={14} className="text-gray-400" />
                <span className="line-clamp-1">{rawData.location}</span>
              </div>
            )} */}
            {proposal.estimatedCost && (
              <div className="flex items-center gap-1 text-xs font-bold text-secondary">
                <span>
                  {currency} {proposal.estimatedCost}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-1">
          {(hasEditRights || canConfirm) && (
            <NeumorphicActionMenu
              options={[
                ...(canConfirm
                  ? [
                      {
                        label: "Confirmar",
                        icon: "check_circle",
                        variant: "default" as const,
                        onClick: () => onConfirm(proposal),
                      },
                    ]
                  : []),
                ...(hasEditRights
                  ? [
                      {
                        label: "Editar",
                        icon: "edit",
                        onClick: () => onEdit(proposal),
                      },
                      {
                        label: "Eliminar",
                        icon: "delete",
                        variant: "danger" as const,
                        onClick: () => onDelete(proposal),
                      },
                    ]
                  : []),
              ]}
            />
          )}
        </div>
      </div>

      {rawData.location && (
        <div className="flex items-center gap-0.5 text-xs text-gray-400 mb-1">
          <Icon name="location_on" size={14} className="text-gray-400" />
          <span className="line-clamp-1">{rawData.location}</span>
        </div>
      )}

      <div className="flex flex-col animate-in slide-in-from-top-2 duration-300">
        {proposal.type === "activity" && (
          <>
            {rawData.date && (
              <div className="flex flex-col p-2 bg-gray-50 dark:bg-gray-800/20 rounded-lg mb-2">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Fecha:</span>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-2000">
                  {formatFirebaseDate(rawData.date)}
                </p>
              </div>
            )}
          </>
        )}

        {proposal.type === "accommodation" && (
          <>
            {rawData.checkIn && (
              <div className="flex flex-col p-2 bg-gray-50 dark:bg-gray-800/20 rounded-lg mb-2">
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
              <div className="flex flex-col p-2 bg-gray-50 dark:bg-gray-800/20 rounded-lg mb-2">
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
      </div>

      {proposal.description && (
        <div className="flex gap-2 bg-white p-2">
          <span className="text-xs font-bold text-gray-800 block">Notas:</span>
          <p className="text-xs text-gray-600">{proposal.description}</p>
        </div>
      )}

      <span className="text-[10px] text-gray-400 flex justify-end">
        Sugerido por {creatorName} -{" "}
        {format(proposal.createdAt, "d 'de' MMMM 'del' yyyy", { locale: es })}
      </span>

      {/* Voting Section */}
      <div>
        <div className="border border-gray-200 mb-4" />
        <div className="flex flex-col gap-2">
          {/* Progress Bar */}
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden flex relative">
            <div
              className={`h-full transition-all duration-700 ease-out ${yesPercentage > 50 ? "bg-success" : "bg-primary-extralight"}`}
              style={{ width: `${yesPercentage}%` }}
            />
          </div>

          {/* Vote Buttons */}
          <div className="flex justify-between mt-1 gap-2">
            <div className="flex items-center">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-tight">
                {totalVotes === 1 ? "1 voto" : `${totalVotes} votos`}
              </span>
            </div>
            <div className="flex gap-2">
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
      </div>
    </NeumorphicCard>
  );
};
