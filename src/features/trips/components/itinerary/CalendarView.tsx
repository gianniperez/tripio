"use client";

import React from "react";
import { Event } from "@/types/tripio";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarViewProps {
  events: Event[];
  trip: import("@/types/tripio").Trip;
}

export const CalendarView = ({ events, trip }: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  // Safety check since we only render if missingDates is false, but TypeScript doesn't know
  const tripStart = trip?.startDate?.toDate();
  const tripEnd = trip?.endDate?.toDate();

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const weekDays = ["D", "L", "M", "M", "J", "V", "S"];

  return (
    <div className="space-y-4">
      {/* Month Selector */}
      <div className="flex items-center justify-between px-2">
        <h4 className="font-black text-lg text-text-main capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: es })}
        </h4>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="cursor-pointer p-2 bg-white rounded-xl shadow-neumorphic-sm text-gray-400 hover:text-primary transition-all active:shadow-neumorphic-inset-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextMonth}
            className="cursor-pointer p-2 bg-white rounded-xl shadow-neumorphic-sm text-gray-400 hover:text-primary transition-all active:shadow-neumorphic-inset-sm"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <NeumorphicCard className="p-4 overflow-hidden">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 mb-2 border-b border-gray-50 pb-2">
          {weekDays.map((day, i) => (
            <div key={i} className="text-center">
              <span className="text-[10px] font-black text-gray-400">
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => {
            const dayEvents = events.filter((e) =>
              isSameDay(e.date.toDate(), day),
            );
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());
            const isTripStart = tripStart ? isSameDay(day, tripStart) : false;
            const isTripEnd = tripEnd ? isSameDay(day, tripEnd) : false;
            const isTripDateBoundary = isTripStart || isTripEnd;

            return (
              <div
                key={i}
                className={`aspect-square p-1 flex flex-col items-center justify-between rounded-lg transition-all ${
                  isTripDateBoundary
                    ? "bg-secondary/10 shadow-neumorphic-inset-sm"
                    : isCurrentMonth
                      ? "bg-transparent"
                      : "opacity-20"
                }`}
              >
                <span
                  className={`text-[10px] font-bold ${
                    isToday
                      ? "text-primary bg-primary/10 w-5 h-5 flex items-center justify-center rounded-full"
                      : isTripDateBoundary
                        ? "text-secondary font-black"
                        : "text-text-main"
                  }`}
                >
                  {format(day, "d")}
                </span>

                <div className="flex flex-wrap gap-0.5 justify-center mt-auto pb-1">
                  {dayEvents.slice(0, 3).map((_, idx) => (
                    <div
                      key={idx}
                      className="w-1 h-1 rounded-full bg-primary"
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="w-1 h-1 rounded-full bg-gray-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </NeumorphicCard>

      {/* Selected Day Events (Simplified for Mobile) */}
      <p className="text-[10px] text-center text-gray-400 italic py-2">
        Tocá un día para ver las actividades configuradas.
      </p>
    </div>
  );
};
