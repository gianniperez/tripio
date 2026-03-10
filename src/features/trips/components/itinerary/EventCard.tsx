"use client";

import React from "react";
import { Event } from "@/types/tripio";
import { format } from "date-fns";
import { ListItemCard } from "@/components/ui/ListItemCard";
import {
  MapPin,
  Clock,
  Bed,
  Car,
  Utensils,
  Camera,
  MoreHorizontal,
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
  const categoryConfig =
    CATEGORY_ICONS[event.category as keyof typeof CATEGORY_ICONS] ||
    CATEGORY_ICONS.other;
  const Icon = categoryConfig.icon;

  return (
    <ListItemCard
      icon={<Icon size={20} className={categoryConfig.color} />}
      iconWrapperClassName={`${categoryConfig.bg} rounded-xl`}
      title={event.title}
      description={event.description}
      rightDetail={
        event.startTime ? (
          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 shrink-0 bg-transparent px-0 py-0">
            <Clock size={10} />
            <span>{format(event.startTime.toDate(), "HH:mm")}</span>
          </div>
        ) : undefined
      }
      actions={
        event.costImpact && event.costImpact > 0 ? (
          <span className="text-[10px] font-black text-text-main bg-gray-50 px-2 py-1 rounded-lg">
            ${event.costImpact}
          </span>
        ) : undefined
      }
    />
  );
};
