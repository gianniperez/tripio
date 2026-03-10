"use client";

import React from "react";
import { Event } from "@/types/tripio";
import { format } from "date-fns";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { 
  MapPin, 
  Clock, 
  Bed, 
  Car, 
  Utensils, 
  Camera, 
  MoreHorizontal 
} from "lucide-react";

interface EventCardProps {
  event: Event;
}

const CATEGORY_ICONS = {
  accommodation: { icon: Bed, color: "text-blue-500", bg: "bg-blue-50" },
  transport: { icon: Car, color: "text-purple-500", bg: "bg-purple-50" },
  food: { icon: Utensils, color: "text-orange-500", bg: "bg-orange-50" },
  activity: { icon: Camera, color: "text-green-500", bg: "bg-green-50" },
  other: { icon: MoreHorizontal, color: "text-gray-500", bg: "bg-gray-50" },
};

export const EventCard = ({ event }: EventCardProps) => {
  const categoryConfig = CATEGORY_ICONS[event.category] || CATEGORY_ICONS.other;
  const Icon = categoryConfig.icon;

  return (
    <NeumorphicCard className="p-4 hover:shadow-neumorphic-sm transition-all group">
      <div className="flex gap-4">
        <div className={`w-10 h-10 rounded-xl ${categoryConfig.bg} flex items-center justify-center shrink-0`}>
          <Icon className={categoryConfig.color} size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h5 className="font-bold text-sm text-text-main truncate group-hover:text-primary transition-colors">
              {event.title}
            </h5>
            {event.startTime && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 mt-0.5 shrink-0">
                <Clock size={10} />
                <span>{format(event.startTime.toDate(), "HH:mm")}</span>
              </div>
            )}
          </div>
          
          {event.location && (
            <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
              <MapPin size={10} />
              <span className="truncate">{event.location}</span>
            </div>
          )}

          {event.description && (
            <p className="text-[11px] text-gray-500 mt-2 line-clamp-2">
              {event.description}
            </p>
          )}

          {event.costImpact && event.costImpact > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
              <span className="text-[10px] font-black text-text-main bg-gray-50 px-2 py-1 rounded-lg">
                ${event.costImpact}
              </span>
            </div>
          )}
        </div>
      </div>
    </NeumorphicCard>
  );
};
