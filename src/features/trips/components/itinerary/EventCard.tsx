"use client";

import React from "react";
import { Event } from "@/types/tripio";
import { format } from "date-fns";
import { ListItemCard } from "@/components/ui/ListItemCard";
import { useRouter, useParams } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

interface EventCardProps {
  event: Event;
}

const CATEGORY_ICONS = {
  accommodation: { icon: "bed", color: "text-blue-500", bg: "bg-blue-50" },
  transport: { icon: "car_repair", color: "text-purple-500", bg: "bg-purple-50" },
  food: { icon: "restaurant", color: "text-orange-500", bg: "bg-orange-50" },
  activity: { icon: "photo_camera", color: "text-green-500", bg: "bg-green-50" },
  other: { icon: "more_horiz", color: "text-gray-500", bg: "bg-gray-50" },
};

export const EventCard = ({ event }: EventCardProps) => {
  const router = useRouter();
  const params = useParams<{ tripId: string }>();
  const categoryConfig =
    CATEGORY_ICONS[event.category as keyof typeof CATEGORY_ICONS] ||
    CATEGORY_ICONS.other;
  const iconName = categoryConfig.icon;

  const handleClick = () => {
    if (params.tripId) {
      const category = event.category;
      let path = "";

      if (category === "accommodation" || category === "transport") {
        path = `/trips/${params.tripId}/logistics`;
      } else if (category === "activity" || (category as string) === "food") {
        path = `/trips/${params.tripId}/activities`;
      } else if ((category as string) === "inventory") {
        path = `/trips/${params.tripId}/inventory`;
      }

      if (path) {
        router.push(path);
      }
    }
  };

  return (
    <ListItemCard
      icon={<Icon name={iconName} size={20} className={categoryConfig.color} />}
      iconWrapperClassName={`${categoryConfig.bg} rounded-xl`}
      title={event.title}
      description={event.description}
      onClick={event.linkedProposalId ? handleClick : undefined}
      rightDetail={
        event.startTime ? (
          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 shrink-0 bg-transparent px-0 py-0">
            <Icon name="schedule" size={10} />
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
