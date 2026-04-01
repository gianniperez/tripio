import { Timestamp } from "firebase/firestore";
import type { Trip } from "@/types/models";

export type TripStatus = "planning" | "active" | "archived";

/**
 * Calcula el estado dinámico del viaje basado en las fechas actuales.
 * - 'planning': si el viaje aún no empezó.
 * - 'active': si la fecha actual está dentro del rango del viaje.
 * - 'archived': si el viaje ya terminó.
 */
export function getDynamicTripStatus(trip: Partial<Trip>): TripStatus {
  if (!trip.startDate || !trip.endDate) {
    return (trip.status as TripStatus) || "planning";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = trip.startDate instanceof Timestamp ? trip.startDate.toDate() : new Date(trip.startDate);
  start.setHours(0, 0, 0, 0);

  const end = trip.endDate instanceof Timestamp ? trip.endDate.toDate() : new Date(trip.endDate);
  end.setHours(23, 59, 59, 999);

  if (start > today) return "planning";
  if (end < today) return "archived";
  return "active";
}
