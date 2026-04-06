import { AccommodationConfirmed } from "@/types/models";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { formatFirebaseDate } from "@/utils/date-utils";
import { useTripCurrency } from "@/features/trips/hooks/useTripCurrency";
import { NeumorphicActionMenu } from "@/components/neumorphic/NeumorphicActionMenu";
import { Icon } from "@/components/ui/Icon";

interface AccommodationCardProps {
  accommodation: AccommodationConfirmed;
  tripId: string;
  onEdit?: (accommodation: AccommodationConfirmed) => void;
  onDelete?: (accommodation: AccommodationConfirmed) => void;
  canEdit?: boolean;
}

export const AccommodationCard = ({
  accommodation,
  tripId,
  onEdit,
  onDelete,
  canEdit = false,
}: AccommodationCardProps) => {
  const currency = useTripCurrency(tripId);

  return (
    <NeumorphicCard>
      <div className="flex items-start justify-between gap-4">
        <div className="w-12 h-12 rounded-full bg-primary-extralight text-white flex items-center justify-center shrink-0">
          <Icon name="hotel" fill />
        </div>
        <div className="flex-1">
          {accommodation.location && (
            <div className="flex items-center gap-0.5 text-xs text-gray-400 -mb-1">
              <Icon name="location_on" size={14} className="text-gray-400" />
              <span className="line-clamp-1">{accommodation.location}</span>
            </div>
          )}
          <h3 className="font-bold text-main">{accommodation.title}</h3>
          {accommodation.priceEstimate && (
            <div className="flex items-center gap-1 text-xs font-bold text-secondary">
              <span>
                {currency} {accommodation.priceEstimate}
              </span>
            </div>
          )}
        </div>

        {canEdit && (
          <NeumorphicActionMenu
            options={[
              {
                label: "Editar",
                icon: "edit",
                onClick: () => onEdit?.(accommodation),
              },
              {
                label: "Eliminar",
                icon: "delete",
                onClick: () => onDelete?.(accommodation),
              },
            ]}
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 px-1">
        {accommodation.checkIn && (
          <div>
            <p className="text-xs font-bold text-gray-800 block uppercase">Check-in</p>
            <p className="text-xs font-medium text-main">
              {formatFirebaseDate(accommodation.checkIn)}
            </p>
          </div>
        )}
        {accommodation.checkOut && (
          <div>
            <p className="text-xs font-bold text-gray-800 block uppercase">Check-out</p>
            <p className="text-xs font-medium text-main">
              {formatFirebaseDate(accommodation.checkOut)}
            </p>
          </div>
        )}
      </div>

      {accommodation.description && (
        <div className="flex gap-2 bg-white mt-4 px-1">
          <span className="text-xs font-bold text-gray-800 block">Notas:</span>
          <p className="text-xs text-gray-600">{accommodation.description}</p>
        </div>
      )}
    </NeumorphicCard>
  );
};
