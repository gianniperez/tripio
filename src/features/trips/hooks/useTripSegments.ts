import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { subscribeToTripSegments } from "../api/getTripSegments";
import { TripSegment } from "@/types/tripio";

export function useTripSegments(tripId: string) {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ["tripSegments", tripId], [tripId]);

  useEffect(() => {
    if (!tripId) return;

    const unsubscribe = subscribeToTripSegments(
      tripId,
      (segments) => {
        queryClient.setQueryData(queryKey, segments);
      },
      (error) => {
        console.error("Error subscribing to segments:", error);
      },
    );

    return () => unsubscribe();
  }, [tripId, queryClient, queryKey]);

  return useQuery<TripSegment[]>({
    queryKey,
    // La data inicial viene del caché setQueryData, o está vacía
    queryFn: () => queryClient.getQueryData(queryKey) ?? [],
    staleTime: Infinity,
  });
}
