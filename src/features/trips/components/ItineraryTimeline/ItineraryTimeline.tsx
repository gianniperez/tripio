import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { Icon } from "@/components/ui/Icon";
import { format, isPast, isToday } from "date-fns";
import { es } from "date-fns/locale";
import type { ItineraryTimelineProps } from "./ItineraryTimeline.types";
import { EmptyState } from "@/components/ui/EmptyState";

export function ItineraryTimeline({ items, onItemClick }: ItineraryTimelineProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No hay planes confirmados"
        description="Las actividades y reservas confirmadas aparecerán aquí."
        icon="event_busy"
      />
    );
  }

  // Agrupar items por día para el Timeline
  const groupedItems = items.reduce(
    (acc, item) => {
      const dateKey = format(item.date, "yyyy-MM-dd");
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(item);
      return acc;
    },
    {} as Record<string, typeof items>
  );

  return (
    <div className="space-y-8 pb-12 relative before:absolute before:left-[19px] before:top-4 before:bottom-0 before:w-0.5 before:bg-slate-100 italic">
      {Object.entries(groupedItems).map(([dateKey, dayItems]) => {
        const date = new Date(dateKey + "T00:00:00");
        const isPastDay = isPast(date) && !isToday(date);

        return (
          <div key={dateKey} className={`relative pl-12 ${isPastDay ? "opacity-60" : ""}`}>
            {/* Indicador de Día en la línea (Dot) */}
            <div
              className={`absolute left-0 top-1 w-[40px] h-[40px] rounded-full border-4 border-background flex items-center justify-center z-10 
              ${isToday(date) ? "bg-primary text-white shadow-soft" : "bg-white text-slate-400 border-slate-50"}`}
            >
              <span className="text-[10px] font-bold uppercase leading-none text-center">
                {format(date, "d")}
                <br />
                {format(date, "MMM", { locale: es }).replace(".", "")}
              </span>
            </div>

            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              {format(date, "EEEE d 'de' MMMM", { locale: es })}
            </h4>

            <div className="space-y-4">
              {dayItems.map((item) => (
                <NeumorphicCard
                  key={item.id}
                  className="p-4 cursor-pointer hover:scale-[1.01] transition-transform"
                  onClick={() => onItemClick?.(item)}
                >
                  <div className="flex gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                      ${
                        item.type === "activity"
                          ? "bg-primary/10 text-primary"
                          : item.type === "accommodation"
                            ? "bg-secondary/10 text-secondary"
                            : "bg-teal-100 text-teal-600"
                      }`}
                    >
                      <Icon
                        name={
                          item.type === "activity"
                            ? "local_activity"
                            : item.type === "accommodation"
                              ? "home"
                              : "flight"
                        }
                        size={20}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {item.type === "activity"
                            ? "Actividad"
                            : item.type === "accommodation"
                              ? item.subType === "check-in"
                                ? "Check-in"
                                : "Check-out"
                              : item.subType === "departure"
                                ? "Salida"
                                : "Llegada"}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">
                          {format(item.date, "HH:mm")}
                        </span>
                      </div>
                      <h5 className="font-bold text-slate-800 truncate">
                        {item.type === "activity" ? item.data.title : item.data.title}
                      </h5>
                      {item.type === "activity" && item.data.location && (
                        <p className="text-xs text-slate-400 truncate flex items-center gap-1 mt-1">
                          <Icon name="location_on" size={12} />
                          {item.data.location}
                        </p>
                      )}
                    </div>
                  </div>
                </NeumorphicCard>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
