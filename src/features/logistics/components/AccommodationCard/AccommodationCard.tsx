import { AccommodationConfirmed } from "@/types/models";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { Icon } from "@/components/ui/Icon";
import { formatFirebaseDate } from "@/utils/date-utils";
import React from "react";

interface AccommodationCardProps {
  accommodation: AccommodationConfirmed;
  onEdit?: (accommodation: AccommodationConfirmed) => void;
  onDelete?: (accommodation: AccommodationConfirmed) => void;
  canEdit?: boolean;
}

export const AccommodationCard = ({
  accommodation,
  onEdit,
  onDelete,
  canEdit = false,
}: AccommodationCardProps) => {
  return (
    <NeumorphicCard className="p-4 relative">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Icon name="hotel" size={18} fill />
            </div>
            <h3 className="font-bold text-text-main line-clamp-1">{accommodation.title}</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Check-in</p>
              <p className="text-sm font-medium text-text-main">
                {formatFirebaseDate(accommodation.checkIn)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Check-out</p>
              <p className="text-sm font-medium text-text-main">
                {formatFirebaseDate(accommodation.checkOut)}
              </p>
            </div>
          </div>

          {accommodation.locationUrl && (
            <a
              href={accommodation.locationUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
            >
              <Icon name="location_on" size={14} />
              Ver en Google Maps
            </a>
          )}
        </div>

        {canEdit && (
          <div className="flex items-center gap-1 bg-surface-main/50 rounded-full p-1 border border-border-main shadow-inner">
            {onEdit && (
              <button
                onClick={() => onEdit(accommodation)}
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-primary transition-colors hover:bg-white rounded-full"
                title="Editar"
              >
                <Icon name="edit" size={16} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(accommodation)}
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors hover:bg-white rounded-full"
                title="Eliminar"
              >
                <Icon name="delete" size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {accommodation.description && (
        <div className="mt-4 p-3 bg-white/40 rounded-xl text-sm text-slate-600 border border-border-main/50">
          {accommodation.description}
        </div>
      )}
    </NeumorphicCard>
  );
};
