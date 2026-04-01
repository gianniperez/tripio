"use client";

import { useEffect, useState } from "react";
import { tripService } from "../../api";
import { TripCard } from "../TripCard";
import { Trip } from "@/types/models";
import { Icon } from "@/components/ui/Icon";
import { Timestamp } from "firebase/firestore";
import type { TripListProps } from "./TripList.types";
import { EmptyState } from "@/components/ui/EmptyState";

export function TripList({ userId }: TripListProps) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(userId ? true : false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchTrips = async () => {
      setLoading(true);
      try {
        const data = await tripService.getTripsByUser(userId);
        // Ordenar por fecha de creación (más recientes primero) o fecha de inicio
        const sorted = data.sort((a, b) => {
          const timeA =
            a.createdAt instanceof Timestamp
              ? a.createdAt.toMillis()
              : (a.createdAt as Date).getTime();
          const timeB =
            b.createdAt instanceof Timestamp
              ? b.createdAt.toMillis()
              : (b.createdAt as Date).getTime();
          return timeB - timeA;
        });
        setTrips(sorted);
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError("No pudimos cargar tus viajes.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [userId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-gray-100 rounded-tripio shadow-gray-inset" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-danger font-medium">
        <Icon name="error" size={48} className="mx-auto mb-2 opacity-50" />
        <p>{error}</p>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <EmptyState
        title="¿A dónde vamos hoy?"
        description="Aún no tienes viajes creados. ¡Empieza uno nuevo y comienza la aventura!"
        icon="explore"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  );
}
