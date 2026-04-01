import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { NeumorphicButton } from "@/components/neumorphic/NeumorphicButton";
import { Icon } from "@/components/ui/Icon";
import type { ItineraryBacklogProps } from "./ItineraryBacklog.types";

export function ItineraryBacklog({ activities, onAssignDate }: ItineraryBacklogProps) {
  if (activities.length === 0) return null;

  return (
    <div className="mt-12">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
          <Icon name="inventory_2" size={18} />
        </div>
        <h3 className="font-display font-bold text-slate-800">
          Backlog <span className="text-slate-400 font-medium text-sm ml-1">({activities.length})</span>
        </h3>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-secondary/5 rounded-2xl border border-dashed border-secondary/20 mb-4">
          <p className="text-xs text-secondary/70 leading-relaxed italic">
            Estas actividades están confirmadas pero aún no tienen una fecha asignada en el itinerario.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activities.map((activity) => (
            <NeumorphicCard key={activity.id} className="p-4 flex flex-col h-full bg-white/50">
              <div className="flex gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary/40 flex items-center justify-center shrink-0">
                  <Icon name="local_activity" size={20} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-700 truncate">{activity.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {activity.description || "Sin descripción"}
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-4 flex justify-end border-t border-slate-50">
                <NeumorphicButton 
                  variant="secondary" 
                  className="px-4 py-2 w-auto text-[10px]"
                  onClick={() => onAssignDate?.(activity)}
                >
                  <Icon name="calendar_add_on" size={14} className="mr-1.5" />
                  Asignar Fecha
                </NeumorphicButton>
              </div>
            </NeumorphicCard>
          ))}
        </div>
      </div>
    </div>
  );
}
