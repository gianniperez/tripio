"use client";

import {
  Trip,
  AccommodationConfirmed,
  TransportConfirmed,
  InventoryConfirmed,
} from "@/types/models";
import { UnifiedProposal } from "@/features/proposals/api/proposalsService";
import { useMemo } from "react";
import { differenceInDays, eachDayOfInterval, format, isWithinInterval, subDays } from "date-fns";
import Link from "next/link";
import { Timestamp } from "firebase/firestore";
import { Icon } from "@/components/ui/Icon";

interface LogisticsWidgetProps {
  trip: Trip;
  accommodations: AccommodationConfirmed[];
  transports: TransportConfirmed[];
  inventory: InventoryConfirmed[];
  proposals: UnifiedProposal[];
}

export function LogisticsWidget({
  trip,
  accommodations,
  transports,
  inventory,
  proposals,
}: LogisticsWidgetProps) {
  const tripId = trip.id;

  // --- ACCOMMODATION LOGIC ---
  const accommodationStatus = useMemo(() => {
    const tripStart = trip.startDate
      ? trip.startDate instanceof Date
        ? trip.startDate
        : (trip.startDate as unknown as Timestamp).toDate()
      : null;
    const tripEnd = trip.endDate
      ? trip.endDate instanceof Date
        ? trip.endDate
        : (trip.endDate as unknown as Timestamp).toDate()
      : null;

    if (!tripStart || !tripEnd)
      return { status: "missing", text: "Sin definir", color: "text-gray-400" };

    const totalNights = differenceInDays(tripEnd, tripStart);
    if (totalNights <= 0) return { status: "missing", text: "Sin definir", color: "text-gray-400" };

    const confirmedProposals = proposals.filter((p) => p.type === "accommodation");
    const hasProposals = confirmedProposals.length > 0;

    if (accommodations.length === 0) {
      return hasProposals
        ? { status: "discussing", text: "En discusión", color: "text-primary-extralight" }
        : { status: "missing", text: "Sin definir", color: "text-gray-400" };
    }

    // Calculate covered nights
    const coveredDays = new Set<string>();
    accommodations.forEach((acc) => {
      const start =
        acc.checkIn instanceof Date ? acc.checkIn : (acc.checkIn as unknown as Timestamp).toDate();
      const end =
        acc.checkOut instanceof Date
          ? acc.checkOut
          : (acc.checkOut as unknown as Timestamp).toDate();

      const interval = eachDayOfInterval({ start, end: subDays(end, 1) });
      interval.forEach((d) => {
        if (isWithinInterval(d, { start: tripStart, end: subDays(tripEnd, 1) })) {
          coveredDays.add(format(d, "yyyy-MM-dd"));
        }
      });
    });

    const missingNights = totalNights - coveredDays.size;

    if (missingNights <= 0)
      return { status: "covered", text: "Todo cubierto", color: "text-success" };
    return {
      status: "partial",
      text: `Faltan ${missingNights} ${missingNights === 1 ? "noche" : "noches"}`,
      color: "text-primary-extralight",
    };
  }, [trip, accommodations, proposals]);

  // --- TRANSPORT LOGIC ---
  const transportStatus = useMemo(() => {
    const hasProposals = proposals.some((p) => p.type === "transport");

    if (transports.length === 0) {
      return hasProposals
        ? { status: "discussing", text: "En discusión", color: "text-primary-extralight" }
        : { status: "missing", text: "Sin definir", color: "text-gray-400" };
    }

    const totalParticipants = trip.participantIds.length;
    const transportsWithCapacity = transports.filter((t) => t.capacity && t.capacity > 0);

    if (transportsWithCapacity.length > 0) {
      const totalCapacity = transportsWithCapacity.reduce((sum, t) => sum + t.capacity, 0);
      if (totalCapacity >= totalParticipants) {
        // Find if all participants are assigned (optional, but requested "X/Y people with seat")
        // Just showing the capacity vs participants for now as requested
        return {
          status: "covered",
          text: `${Math.min(totalCapacity, totalParticipants)}/${totalParticipants} personas con asiento`,
          color: "text-success",
        };
      } else {
        return {
          status: "partial",
          text: `${totalCapacity}/${totalParticipants} personas con asiento`,
          color: "text-primary-extralight",
        };
      }
    }

    // Default for transports without capacity (like flights/trains)
    return { status: "covered", text: "Todo cubierto", color: "text-success" };
  }, [trip, transports, proposals]);

  // --- INVENTORY LOGIC ---
  const inventoryStatus = useMemo(() => {
    if (inventory.length === 0) {
      const hasProposals = proposals.some((p) => p.type === "inventory");
      return hasProposals
        ? { status: "discussing", text: "En discusión", color: "text-primary-extralight" }
        : { status: "empty", text: "Sin ítems", color: "text-gray-400" };
    }

    const unassignedCount = inventory.filter((item) => !item.assignedTo).length;

    if (unassignedCount === 0) {
      return {
        status: "covered",
        text: "¡Todo en orden!",
        color: "text-success",
        subtext: "Todos los ítems están asignados",
      };
    }

    return {
      status: "partial",
      text: `${unassignedCount} ${unassignedCount === 1 ? "ítem sin asignar" : "ítems sin asignar"}`,
      color: "text-primary-extralight",
    };
  }, [inventory, proposals]);

  return (
    <div className="w-full bg-white rounded-tripio p-6 shadow-neumorphic border border-gray-100/50 transition-all duration-300 hover:scale-[1.02]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Alojamiento */}
        <Link href={`/trips/${tripId}/logistics?tab=accommodation`} className="block group/item">
          <StatusItem
            icon="hotel"
            label="Alojamiento/s"
            value={accommodationStatus.text}
            color={accommodationStatus.color}
          />
        </Link>

        {/* Transporte */}
        <Link href={`/trips/${tripId}/logistics?tab=transport`} className="block group/item">
          <StatusItem
            icon="directions_car"
            label="Transporte/s"
            value={transportStatus.text}
            color={transportStatus.color}
          />
        </Link>

        {/* Inventario */}
        <Link href={`/trips/${tripId}/logistics?tab=inventory`} className="block group/item">
          <StatusItem
            icon="inventory_2"
            label="Inventario"
            value={inventoryStatus.text}
            color={inventoryStatus.color}
            subtext={inventoryStatus.subtext}
          />
        </Link>
      </div>
    </div>
  );
}

function StatusItem({
  icon,
  label,
  value,
  color,
  subtext,
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
  subtext?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`p-2 rounded-xl bg-gray-50 ${color.replace("text-", "bg-").replace("success", "success/10").replace("primary-extralight", "primary-extralight/10").replace("gray-400", "gray-100")}`}
      >
        <Icon name={icon} fill className={color} size={24} />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">
          {label}
        </span>
        <span
          className={`font-display font-black text-sm leading-tight ${color === "text-gray-400" ? "text-main/60" : color}`}
        >
          {value}
        </span>
        {subtext && <span className="text-[10px] font-medium text-gray-400 mt-0.5">{subtext}</span>}
      </div>
    </div>
  );
}
