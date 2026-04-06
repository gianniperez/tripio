"use client";

import { useState } from "react";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { Icon } from "@/components/ui/Icon";
import { format, isPast, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { EmptyState } from "@/components/ui/EmptyState";
import { useTripCosts } from "@/features/finances/hooks/useCosts";
import { useTripCurrency } from "@/features/trips/hooks/useTripCurrency";
import { Modal } from "@/components/ui/dialog/Modal";
import { CostForm } from "@/features/finances/components/CostForm";
import type { ItineraryTimelineProps } from "./ItineraryTimeline.types";
import { ItineraryItem } from "../../types";


export function ItineraryTimeline({ tripId, items, onItemClick }: ItineraryTimelineProps) {
  const { data: costs } = useTripCosts(tripId);
  const currency = useTripCurrency(tripId);
  const [selectedItemForExpense, setSelectedItemForExpense] = useState<ItineraryItem | null>(null);

  if (items.length === 0) {
    return (
      <EmptyState
        title="Tu itinerario está vacío"
        description="Agrega actividades, alojamientos o transportes para empezar a armar tu viaje."
      />
    );
  }

  // Agrupar items por fecha (YYYY-MM-DD)
  const groupedItems = items.reduce((acc: Record<string, typeof items>, item) => {
    const dateKey = format(item.date, "yyyy-MM-dd");
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-8 pb-12 relative before:absolute before:left-[7px] before:top-4 before:bottom-0 before:w-0.5 before:bg-gray-300">
      {(Object.entries(groupedItems) as [string, typeof items][]).map(([dateKey, dayItems]) => {
        const date = new Date(dateKey + "T00:00:00");
        const isPastDay = isPast(date) && !isToday(date);

        return (
          <div key={dateKey} className="relative pl-8">
            <div
              className={`absolute left-0 top-1 w-4 h-4 rounded-full flex items-center justify-center
              ${isToday(date) ? "bg-primary" : isPastDay ? "bg-gray-300" : "bg-white border-3 border-gray-300"}`}
            />

            <div className={`${isPastDay ? "opacity-60" : ""}`}>
              <span className="text-[10px] font-bold text-center">
                {format(date, "EEEE d 'de' MMMM", { locale: es })
                  .replace(/^\w/, (l) => l.toUpperCase())
                  .replace(/de (\w)/, (match, p1) => `de ${p1.toUpperCase()}`)}
              </span>
              <div className="space-y-4 mt-2">
                {dayItems.map((item) => {
                  const itemEntityId = item.id.split('-')[0] || item.id;
                  const itemCosts = costs?.filter(c => c.linkedTo === itemEntityId) || [];
                  const totalCost = itemCosts.reduce((sum, c) => sum + c.amount, 0);

                  return (
                    <NeumorphicCard
                      key={item.id}
                      className="cursor-pointer hover:scale-[1.02] transition-transform"
                      onClick={() => onItemClick?.(item)}
                    >
                      <div className="flex gap-3">
                        <div
                          className={`w-10 h-10 text-white rounded-full flex items-center justify-center shrink-0
                        ${
                          item.type === "activity"
                            ? "bg-primary"
                            : item.type === "accommodation"
                              ? "bg-primary-extralight"
                              : "bg-secondary"
                        }`}
                        >
                          <Icon
                            name={
                              item.type === "activity"
                                ? "local_activity"
                                : item.type === "accommodation"
                                  ? "hotel"
                                  : "directions_car"
                            }
                            size={20}
                            fill
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">
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
                            <span className="text-[10px] font-medium text-gray-400">
                              {format(item.date, "HH:mm")}
                            </span>
                          </div>
                          <h5 className="font-bold text-gray-800 truncate">
                            {item.data.title}
                          </h5>
                          
                          <div className="mt-2 flex items-center justify-between">
                            <div>
                              {item.type === "activity" && item.data.location && (
                                <p className="text-[10px] text-gray-400 truncate">
                                  {item.data.location}
                                </p>
                              )}
                              {totalCost > 0 && (
                                <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
                                  <Icon name="payments" size={10} />
                                  <span>{currency} {totalCost.toFixed(2)}</span>
                                </div>
                              )}
                            </div>
                            
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItemForExpense(item);
                              }}
                              className="text-[10px] font-bold text-brand-500 hover:text-brand-600 flex items-center gap-1"
                            >
                              <Icon name="add" size={12} />
                              Gasto
                            </button>
                          </div>
                        </div>
                      </div>
                    </NeumorphicCard>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      <Modal 
        isOpen={!!selectedItemForExpense} 
        onClose={() => setSelectedItemForExpense(null)}
        title="Registrar Gasto"
        description={`Vincular un nuevo gasto a "${selectedItemForExpense?.data?.title}"`}
      >
        {selectedItemForExpense && (
          <div className="mt-4">
            <CostForm 
              tripId={tripId}
              onSuccess={() => {
                setSelectedItemForExpense(null);
                // The cost hook will automatically refetch
              }}
              onCancel={() => setSelectedItemForExpense(null)}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
