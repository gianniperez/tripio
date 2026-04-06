import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { Icon } from "@/components/ui/Icon";
import type { ItineraryBacklogProps } from "./ItineraryBacklog.types";

export function ItineraryBacklog({ activities, onAssignDate }: ItineraryBacklogProps) {
  if (activities.length === 0) return null;

  return (
    <div className="mt-12 space-y-4">
      <div>
        <h2 className="text-lg font-display font-black text-main">
          Backlog <span className="text-gray-400 font-medium">({activities.length})</span>
        </h2>
        <p className="text-xs font-medium text-main mt-1">
          Estas actividades están confirmadas pero aún no tienen una fecha asignada en el
          itinerario.
        </p>
      </div>

      {activities.map((activity) => (
        <NeumorphicCard key={activity.id} className="flex gap-4 mb-4 items-center justify-between">
          <div className="flex gap-4 w-58 lg:w-full">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
              <Icon name="local_activity" size={20} fill />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-gray-700 truncate">{activity.title}</h4>
              <p className="text-xs text-gray-400 line-clamp-1">
                {activity.description || "Sin descripción"}
              </p>
            </div>
          </div>

          <NeumorphicButton
            variant="tertiary"
            onClick={() => onAssignDate?.(activity)}
            className="w-fit py-2 text-xs"
          >
            <Icon name="calendar_add_on" size={18} className="md:mr-1" />
            <span className="hidden md:block">Asignar Fecha</span>
          </NeumorphicButton>
        </NeumorphicCard>
      ))}
    </div>
  );
}
