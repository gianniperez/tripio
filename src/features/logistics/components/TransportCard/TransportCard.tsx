import { TransportConfirmed } from "@/types/models";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { Icon } from "@/components/ui/Icon";
import { formatFirebaseDate } from "@/utils/date-utils";
import React from "react";

interface TransportCardProps {
  transport: TransportConfirmed;
  onEdit?: (transport: TransportConfirmed) => void;
  onDelete?: (transport: TransportConfirmed) => void;
  canEdit?: boolean;
  currentUserUid: string;
  onJoin?: (transportId: string, join: boolean) => void;
}

export const TransportCard = ({
  transport,
  onEdit,
  onDelete,
  canEdit = false,
  currentUserUid,
  onJoin,
}: TransportCardProps) => {
  const getIconForType = (type: string) => {
    switch (type) {
      case "flight": return "flight";
      case "car": return "directions_car";
      case "bus": return "directions_bus";
      case "train": return "train";
      default: return "commute";
    }
  };

  const isJoined = transport.passengers?.includes(currentUserUid);
  const isFull = (transport.capacity || 0) > 0 && (transport.passengers?.length || 0) >= transport.capacity;

  return (
    <NeumorphicCard className="p-4 relative">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <Icon name={getIconForType(transport.type)} size={18} fill />
            </div>
            <h3 className="font-bold text-text-main line-clamp-1">{transport.title}</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 relative">
            {/* Connection line */}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-border-main/50 z-0"></div>
            
            <div className="z-10 bg-background/80 pr-2">
              <p className="text-xs text-slate-500 uppercase font-semibold">Salida</p>
              <p className="text-sm font-medium text-text-main">
                {formatFirebaseDate(transport.departure)}
              </p>
            </div>
            <div className="z-10 bg-background/80 pl-2 text-right">
              <p className="text-xs text-slate-500 uppercase font-semibold">Llegada</p>
              <p className="text-sm font-medium text-text-main">
                {formatFirebaseDate(transport.arrival)}
              </p>
            </div>
          </div>
        </div>

        {canEdit && (
          <div className="flex items-center gap-1 bg-surface-main/50 rounded-full p-1 border border-border-main shadow-inner">
            {onEdit && (
              <button
                onClick={() => onEdit(transport)}
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-secondary transition-colors hover:bg-white rounded-full"
                title="Editar"
              >
                <Icon name="edit" size={16} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(transport)}
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors hover:bg-white rounded-full"
                title="Eliminar"
              >
                <Icon name="delete" size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {transport.capacity > 0 && (
        <div className="mt-5 p-3 rounded-xl bg-slate-50 min-w-full">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-slate-500">
              PASAJEROS ({transport.passengers?.length || 0}/{transport.capacity})
            </div>
            {onJoin && (
              <button
                onClick={() => onJoin(transport.id, !isJoined)}
                disabled={!isJoined && isFull}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  isJoined
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : isFull
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-secondary text-white hover:bg-secondary-hard shadow-sm"
                }`}
              >
                {isJoined ? "Bajarme" : isFull ? "Lleno" : "Sumarme"}
              </button>
            )}
          </div>
          
          {/* Progress bar */}
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${isFull ? 'bg-red-400' : 'bg-secondary'}`} 
              style={{ width: `${Math.min(100, ((transport.passengers?.length || 0) / transport.capacity) * 100)}%` }}
            />
          </div>
        </div>
      )}
    </NeumorphicCard>
  );
};
