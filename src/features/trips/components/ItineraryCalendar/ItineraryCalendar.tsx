"use client";

import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameDay, isToday } from "date-fns";
import { es } from "date-fns/locale";
import type { ItineraryCalendarProps } from "./ItineraryCalendar.types";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

export function ItineraryCalendar({ items, onDayClick }: ItineraryCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const getItemsForDay = (day: Date) => {
    return items.filter(item => isSameDay(item.date, day));
  };

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));

  return (
    <div className="bg-white rounded-tripio shadow-soft p-4 border border-slate-50">
      {/* Header del Calendario */}
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="font-display font-bold text-slate-800 capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: es })}
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={prevMonth}
            className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-white hover:shadow-soft active:shadow-inset transition-all"
          >
            <Icon name="chevron_left" size={20} />
          </button>
          <button 
            onClick={nextMonth}
            className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-white hover:shadow-soft active:shadow-inset transition-all"
          >
            <Icon name="chevron_right" size={20} />
          </button>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["L", "M", "M", "J", "V", "S", "D"].map((day, idx) => (
          <div key={idx} className="text-center text-[10px] font-bold text-slate-300 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Grilla de Días */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, idx) => {
          const dayItems = getItemsForDay(day);
          const isSelectedMonth = isSameMonth(day, monthStart);
          
          return (
            <div 
              key={idx}
              onClick={() => isSelectedMonth && onDayClick?.(day)}
              className={`
                aspect-square relative rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center
                ${!isSelectedMonth ? "opacity-20 cursor-default" : "hover:bg-slate-50 active:shadow-inset"}
                ${isToday(day) ? "border-2 border-primary/20 bg-primary/5" : ""}
              `}
            >
              <span className={`text-xs font-bold mb-1 ${isToday(day) ? "text-primary" : "text-slate-600"}`}>
                {format(day, "d")}
              </span>
              
              {/* Indicadores de Actividades (Dots) */}
              {dayItems.length > 0 && isSelectedMonth && (
                <div className="flex gap-0.5 flex-wrap justify-center px-1">
                  {dayItems.slice(0, 3).map((item, i) => (
                    <div 
                      key={i} 
                      className={`w-1.5 h-1.5 rounded-full 
                        ${item.type === "activity" ? "bg-primary" : 
                          item.type === "accommodation" ? "bg-secondary" : 
                          "bg-teal-400"}`}
                    />
                  ))}
                  {dayItems.length > 3 && (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
