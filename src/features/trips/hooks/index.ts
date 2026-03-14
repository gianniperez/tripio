import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTripsByUserId } from "../api/getTrips";
import { getTripById } from "../api/getTrip";
import { createTrip, CreateTripDTO } from "../api/createTrip";
import { updateTrip, UpdateTripDTO } from "../api/updateTrip";
import {
  updateParticipant,
  UpdateParticipantParams,
} from "../api/updateParticipant";
import { deleteTrip } from "../api/deleteTrip";
import { getEventsByTripId } from "../api/getEvents";
import { Trip, Event } from "@/types/tripio";
import { useEffect, useState } from "react";

export const useTrips = (userId: string | undefined) => {
  return useQuery<Trip[]>({
    queryKey: ["trips", userId],
    queryFn: () => getTripsByUserId(userId!),
    enabled: !!userId,
  });
};

export const useTrip = (tripId: string | undefined) => {
  return useQuery<Trip | null>({
    queryKey: ["trip", tripId],
    queryFn: () => getTripById(tripId!),
    enabled: !!tripId,
  });
};

export const useCreateTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTripDTO) => createTrip(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trips", variables.userId] });
    },
  });
};

export const useUpdateTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tripId, data }: { tripId: string; data: UpdateTripDTO }) =>
      updateTrip(tripId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trip", variables.tripId] });
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });
};

export const useUpdateParticipant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateParticipantParams) => updateParticipant(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trip", variables.tripId] });
      queryClient.invalidateQueries({
        queryKey: ["participants", variables.tripId],
      });
    },
  });
};

export const useDeleteTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tripId: string) => deleteTrip(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });
};

export const useEvents = (tripId: string | undefined) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!tripId) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    try {
      const unsubscribe = getEventsByTripId(
        tripId,
        (data) => {
          setEvents(data);
          setIsLoading(false);
        },
        (err) => {
          setError(err);
          setIsLoading(false);
        },
      );
      return () => unsubscribe();
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
    }
  }, [tripId]);

  return { data: events, isLoading, error };
};

export * from "./useTripSegments";
export * from "./useCreateTripSegment";
export * from "./useSyncTripSummary";
