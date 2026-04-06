import { TransportConfirmed } from "@/types/models";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { Icon } from "@/components/ui/Icon";
import { formatFirebaseDate } from "@/utils/date-utils";
import { useTripCurrency } from "@/features/trips/hooks/useTripCurrency";
import { NeumorphicActionMenu } from "@/components/neumorphic/NeumorphicActionMenu";

interface TransportCardProps {
  transport: TransportConfirmed;
  tripId: string;
  onEdit?: (transport: TransportConfirmed) => void;
  onDelete?: (transport: TransportConfirmed) => void;
  canEdit?: boolean;
  currentUserUid: string;
  onJoin?: (transportId: string, join: boolean) => void;
}

export const TransportCard = ({
  transport,
  tripId,
  onEdit,
  onDelete,
  canEdit = false,
  currentUserUid,
  onJoin,
}: TransportCardProps) => {
  const currency = useTripCurrency(tripId);

  const isJoined = transport.passengers?.includes(currentUserUid);
  const isFull =
    (transport.capacity || 0) > 0 && (transport.passengers?.length || 0) >= transport.capacity;

  return (
    <NeumorphicCard>
      <div className="flex items-start justify-between gap-4">
        <div className="w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center shrink-0">
          <Icon name="directions_car" fill />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-main">{transport.title}</h3>
          {transport.priceEstimate && (
            <div className="flex items-center gap-1 text-xs font-bold text-secondary">
              <span>
                {currency} {transport.priceEstimate}
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
                onClick: () => onEdit?.(transport),
              },
              {
                label: "Eliminar",
                icon: "delete",
                onClick: () => onDelete?.(transport),
              },
            ]}
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 px-1">
        {transport.departure && (
          <div>
            <p className="text-xs font-bold text-gray-800 block uppercase">Salida</p>
            <p className="text-xs font-medium text-main">
              {formatFirebaseDate(transport.departure)}
            </p>
          </div>
        )}
        {transport.arrival && (
          <div>
            <p className="text-xs font-bold text-gray-800 block uppercase">Llegada</p>
            <p className="text-xs font-medium text-main">{formatFirebaseDate(transport.arrival)}</p>
          </div>
        )}
      </div>

      {transport.description && (
        <div className="flex gap-2 bg-white mt-4 px-1">
          <span className="text-xs font-bold text-gray-800 block">Notas:</span>
          <p className="text-xs text-gray-600">{transport.description}</p>
        </div>
      )}

      {transport.capacity > 0 && (
        <div className="mt-5 p-3 rounded-xl bg-gray-50 min-w-full">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-gray-500">
              PASAJEROS ({transport.passengers?.length || 0}/{transport.capacity})
            </div>
            {onJoin && (
              <button
                onClick={() => onJoin(transport.id, !isJoined)}
                disabled={!isJoined && isFull}
                className={`cursor-pointer text-xs px-4 py-2 rounded-full font-medium transition-all ${
                  isJoined
                    ? "bg-danger/10 text-danger hover:bg-danger/40"
                    : isFull
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-secondary text-white hover:bg-secondary-hard shadow-sm"
                }`}
              >
                {isJoined ? "Bajarme" : isFull ? "Lleno" : "Sumarme"}
              </button>
            )}
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${isFull ? "bg-danger" : "bg-secondary"}`}
              style={{
                width: `${Math.min(100, ((transport.passengers?.length || 0) / transport.capacity) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}
    </NeumorphicCard>
  );
};
