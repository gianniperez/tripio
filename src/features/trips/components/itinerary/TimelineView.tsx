"use client";

import { Event } from "@/types/tripio";
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { EventCard } from "./EventCard";
import { Icon } from "@/components/ui/Icon";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { useRouter } from "next/navigation";

interface TimelineViewProps {
  events: Event[];
  trip: import("@/types/tripio").Trip;
  tripId: string;
}

export const TimelineView = ({ events, trip, tripId }: TimelineViewProps) => {
  const router = useRouter();

  if (events.length === 0) {
    return (
      <NeumorphicCard className="p-12 flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center shadow-neumorphic-inset-sm">
          <Icon name="calendar_month" size={32} className="text-gray-300" />
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

  // 1. Separate accommodations from other events
  const accommodations = events.filter((e) => e.category === "accommodation");
  const otherEvents = events.filter((e) => e.category !== "accommodation");

  // Sort accommodations by start date
  accommodations.sort((a, b) => a.date.seconds - b.date.seconds);

  // 2. Build segments for each accommodation
  const segments = accommodations.map((acc) => ({
    accommodation: acc,
    days: {} as { [key: string]: Event[] },
  }));

  // 3. Assign other events to accommodations or unassigned pool
  const unassignedEvents: { [key: string]: Event[] } = {};

  otherEvents.forEach((event) => {
    const eventDate = event.date.toDate();
    const dateKey = format(eventDate, "yyyy-MM-dd");

    const matchingSegment = segments.find((seg) => {
      const start = startOfDay(seg.accommodation.startTime!.toDate());
      const end = seg.accommodation.endTime
        ? endOfDay(seg.accommodation.endTime.toDate())
        : start;
      return isWithinInterval(eventDate, { start, end });
    });

    if (matchingSegment) {
      if (!matchingSegment.days[dateKey]) matchingSegment.days[dateKey] = [];
      matchingSegment.days[dateKey].push(event);
    } else {
      if (!unassignedEvents[dateKey]) unassignedEvents[dateKey] = [];
      unassignedEvents[dateKey].push(event);
    }
  });

  // Trip date markers
  const tripStartDateKey = trip?.startDate
    ? format(trip.startDate.toDate(), "yyyy-MM-dd")
    : null;
  const tripEndDateKey = trip?.endDate
    ? format(trip.endDate.toDate(), "yyyy-MM-dd")
    : null;

  // Day group renderer
  const renderDayGroup = (
    dateKey: string,
    dayEvents: Event[],
    isTripStart: boolean,
    isTripEnd: boolean,
  ) => (
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
        {isTripStart && (
          <div className="flex items-center gap-3 py-2 opacity-60">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 shadow-neumorphic-inset-sm">
              <span className="text-xl">🏁</span>
            </div>
            <span className="text-sm font-bold uppercase tracking-widest text-emerald-700">
              Comienzo del viaje
            </span>
          </div>
        )}

        {dayEvents.length === 0 && !(isTripStart || isTripEnd) ? (
          <p className="text-xs text-gray-400 italic py-2">
            Sin plan definido.
          </p>
        ) : null}

        {dayEvents
          .sort((a, b) => a.date.seconds - b.date.seconds)
          .map((event) => (
            <EventCard key={event.id} event={event} />
          ))}

        {isTripEnd && (
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
  );

  // Accommodation card renderer
  const renderAccommodationCard = (acc: Event, idx: number) => (
    <div
      key={acc.id}
      className="ml-8 mb-6 bg-blue-50/50 border border-blue-100 rounded-2xl p-4 relative overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
      onClick={() => {
        if (acc.linkedProposalId) {
          router.push(`/trips/${tripId}/logistics`);
        }
      }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

      <div className="flex items-start gap-4 relative z-10">
        <div className="w-10 h-10 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
          <Icon name="bed" size={20} />
        </div>
        <div>
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1 block">
            Estadía {idx + 1}
          </span>
          <h3 className="font-bold text-text-main text-lg leading-tight mb-1">
            {acc.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-2">
            {acc.startTime && (
              <span className="flex items-center bg-white px-2 py-1 rounded-lg border border-slate-100">
                <Icon
                  name="calendar_month"
                  size={12}
                  className="mr-1.5 text-slate-400"
                />
                {format(acc.startTime.toDate(), "d MMM", {
                  locale: es,
                })}
                {acc.endTime &&
                  ` - ${format(acc.endTime.toDate(), "d MMM", { locale: es })}`}
              </span>
            )}
            {acc.location && (
              <span className="flex items-center text-slate-500 truncate max-w-[150px]">
                <Icon
                  name="map"
                  size={12}
                  className="mr-1 text-slate-400 shrink-0"
                />
                <span className="truncate">{acc.location}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
      {/* Unassigned events (before any or between accommodations) */}
      {Object.keys(unassignedEvents)
        .sort()
        .map((dateKey) =>
          renderDayGroup(
            dateKey,
            unassignedEvents[dateKey],
            dateKey === tripStartDateKey,
            dateKey === tripEndDateKey,
          ),
        )}

      {/* Accommodation Segments */}
      {segments.map((seg, idx) => {
        const sortedDateKeys = Object.keys(seg.days).sort();

        return (
          <div key={seg.accommodation.id} className="relative pt-2 pb-2">
            {renderAccommodationCard(seg.accommodation, idx)}

            {sortedDateKeys.length > 0 ? (
              sortedDateKeys.map((dateKey) =>
                renderDayGroup(
                  dateKey,
                  seg.days[dateKey],
                  dateKey === tripStartDateKey,
                  dateKey === tripEndDateKey,
                ),
              )
            ) : (
              <div className="pl-12 py-4">
                <p className="text-xs text-gray-400 italic">
                  No hay actividades planificadas durante esta estadía.
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
