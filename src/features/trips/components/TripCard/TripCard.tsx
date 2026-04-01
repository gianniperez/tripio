import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { Icon } from "@/components/ui/Icon";
import { Timestamp } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import type { TripCardProps } from "./TripCard.types";
import { getDynamicTripStatus } from "@/features/trips/utils/tripUtils";

export function TripCard({ trip }: TripCardProps) {
  const formatDate = (date: (Timestamp | Date) | null | undefined) => {
    if (!date) return "N/D";
    const d = date instanceof Timestamp ? date.toDate() : date;
    return d.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const statusColors = {
    planning: "bg-orange-100 text-orange-600",
    active: "bg-green-100 text-green-600",
    archived: "bg-gray-100 text-gray-600",
  };

  const statusLabels = {
    planning: "Planeando",
    active: "Activo",
    archived: "Archivado",
  };

  const dynamicStatus = getDynamicTripStatus(trip);

  return (
    <Link href={`/trips/${trip.id}`} className="block transition-transform hover:scale-[1.02]">
      <NeumorphicCard className="p-0 overflow-hidden h-full flex flex-col">
        {/* Cover Image Placeholder or Real */}
        <div className="h-48 bg-secondary/25 flex items-center justify-center relative overflow-hidden">
          {trip.coverImage ? (
            <Image src={trip.coverImage} alt={trip.name} fill className="object-cover" />
          ) : (
            <Icon name="landscape" size={48} className="text-secondary/60" />
          )}
          <div
            className={`absolute top-3 right-3 px-4 py-1 rounded-full text-[10px] font-bold uppercase ${statusColors[dynamicStatus]}`}
          >
            {statusLabels[dynamicStatus]}
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-display font-bold text-lg text-main line-clamp-1 mb-1">
            {trip.name}
          </h3>

          <div className="flex items-center gap-2 text-gray-500 text-xs mb-3">
            <Icon name="calendar_today" size={14} />
            <span>
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </span>
          </div>
        </div>
      </NeumorphicCard>
    </Link>
  );
}
