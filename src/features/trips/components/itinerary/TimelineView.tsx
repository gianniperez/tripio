"use client";

import React from "react";
import { Event } from "@/types/tripio";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { EventCard } from "./EventCard";
import { Calendar as CalendarIcon } from "lucide-react";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";

interface TimelineViewProps {
  events: Event[];
  trip: import("@/types/tripio").Trip;
}

export const TimelineView = ({ events, trip }: TimelineViewProps) => {
  if (events.length === 0) {
    return (
      <NeumorphicCard className="p-12 flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center shadow-neumorphic-inset-sm">
          <CalendarIcon size={32} className="text-gray-300" />
        </div>
        <div>
          <h3 className="font-bold text-text-main">Tu itinerario está vacío</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-[200px]">
            Confirmá propuestas para que aparezcan automáticamente aquí.
          </p>
        </div>
      </NeumorphicCard>
    );
  }

  // Group events by day
  const groupedEvents: { [key: string]: Event[] } = {};

  const tripStartDateKey = trip?.startDate
    ? format(trip.startDate.toDate(), "yyyy-MM-dd")
    : null;
  const tripEndDateKey = trip?.endDate
    ? format(trip.endDate.toDate(), "yyyy-MM-dd")
    : null;

  // Initialize boundary arrays so days are rendered even if empty
  if (tripStartDateKey) groupedEvents[tripStartDateKey] = [];
  if (tripEndDateKey) groupedEvents[tripEndDateKey] = [];

  events.forEach((event) => {
    const dateKey = format(event.date.toDate(), "yyyy-MM-dd");
    if (!groupedEvents[dateKey]) {
      groupedEvents[dateKey] = [];
    }
    groupedEvents[dateKey].push(event);
  });

  // Sort dates
  const sortedDateKeys = Object.keys(groupedEvents).sort();

  return (
    <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
      {sortedDateKeys.map((dateKey) => (
        <div key={dateKey} className="space-y-4">
          <div className="flex items-center gap-4 sticky top-0 bg-[--bg-color] py-1 z-10">
            <div className="w-10 h-10 rounded-xl bg-white shadow-neumorphic-sm flex flex-col items-center justify-center shrink-0">
              <span className="text-[10px] font-black text-primary uppercase leading-none">
                {format(new Date(dateKey + "T12:00:00"), "MMM", { locale: es })}
              </span>
              <span className="text-sm font-black text-text-main leading-none">
                {format(new Date(dateKey + "T12:00:00"), "dd")}
              </span>
            </div>
            <h4 className="font-bold text-sm text-text-main capitalize">
              {format(new Date(dateKey + "T12:00:00"), "EEEE", { locale: es })}
            </h4>
          </div>

          <div className="pl-12 space-y-4">
            {dateKey === tripStartDateKey && (
              <div className="flex items-center gap-3 py-2 opacity-60">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 shadow-neumorphic-inset-sm">
                  <span className="text-xl">🏁</span>
                </div>
                <span className="text-sm font-bold uppercase tracking-widest text-emerald-700">
                  Comienzo de la Aventura
                </span>
              </div>
            )}

            {groupedEvents[dateKey].length === 0 &&
            !(dateKey === tripStartDateKey || dateKey === tripEndDateKey) ? (
              <p className="text-xs text-gray-400 italic py-2">
                Sin plan definido.
              </p>
            ) : null}

            {groupedEvents[dateKey].map((event) => (
              <EventCard key={event.id} event={event} />
            ))}

            {dateKey === tripEndDateKey && (
              <div className="flex items-center gap-3 py-2 opacity-60">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0 shadow-neumorphic-inset-sm">
                  <span className="text-xl">👋</span>
                </div>
                <span className="text-sm font-bold uppercase tracking-widest text-rose-700">
                  Fin del Viaje
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
