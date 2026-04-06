import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { logisticsService } from "../api/logisticsService";
import { AccommodationConfirmed, TransportConfirmed, InventoryConfirmed } from "@/types/models";

const ACCOMMODATIONS_KEY = "trip-accommodations-confirmed";
const TRANSPORTS_KEY = "trip-transports-confirmed";
const INVENTORY_KEY = "trip-inventory-confirmed";

export const useAccommodations = (tripId: string) => {
  return useQuery({
    queryKey: [ACCOMMODATIONS_KEY, tripId],
    queryFn: () => logisticsService.getAccommodations(tripId),
    enabled: !!tripId,
  });
};

export const useCreateAccommodation = (tripId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) =>
      logisticsService.createAccommodation(tripId, userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOMMODATIONS_KEY, tripId] });
      queryClient.invalidateQueries({ queryKey: ["itinerary-items", tripId] });
    },
  });
};

export const useUpdateAccommodation = (tripId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<AccommodationConfirmed> }) =>
      logisticsService.updateAccommodation(tripId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOMMODATIONS_KEY, tripId] });
      queryClient.invalidateQueries({ queryKey: ["itinerary-items", tripId] });
    },
  });
};

export const useCreateTransport = (tripId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) =>
      logisticsService.createTransport(tripId, userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSPORTS_KEY, tripId] });
      queryClient.invalidateQueries({ queryKey: ["itinerary-items", tripId] });
    },
  });
};

export const useTransports = (tripId: string) => {
  return useQuery({
    queryKey: [TRANSPORTS_KEY, tripId],
    queryFn: () => logisticsService.getTransports(tripId),
    enabled: !!tripId,
  });
};

export const useUpdateTransport = (tripId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<TransportConfirmed> }) =>
      logisticsService.updateTransport(tripId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSPORTS_KEY, tripId] });
      queryClient.invalidateQueries({ queryKey: ["itinerary-items", tripId] });
    },
  });
};

export const useUpdateTransportPassengers = (tripId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ transportId, newPassengers }: { transportId: string, newPassengers: string[] }) =>
      logisticsService.updateTransportPassengers(tripId, transportId, newPassengers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSPORTS_KEY, tripId] });
    },
  });
};

export const useCreateInventory = (tripId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) =>
      logisticsService.createInventory(tripId, userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVENTORY_KEY, tripId] });
    },
  });
};

export const useInventory = (tripId: string) => {
  return useQuery({
    queryKey: [INVENTORY_KEY, tripId],
    queryFn: () => logisticsService.getInventory(tripId),
    enabled: !!tripId,
  });
};

export const useUpdateInventory = (tripId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ inventoryId, updates }: { inventoryId: string, updates: Partial<InventoryConfirmed> }) =>
      logisticsService.updateInventory(tripId, inventoryId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVENTORY_KEY, tripId] });
    },
  });
};

export const useUpdateInventoryStatus = (tripId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ inventoryId, updates }: { inventoryId: string, updates: Partial<InventoryConfirmed> }) =>
      logisticsService.updateInventoryStatus(tripId, inventoryId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVENTORY_KEY, tripId] });
    },
  });
};

// Delete hooks
export const useDeleteAccommodation = (tripId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => logisticsService.deleteAccommodation(tripId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOMMODATIONS_KEY, tripId] });
      queryClient.invalidateQueries({ queryKey: ["itinerary-items", tripId] });
    },
  });
};

export const useDeleteTransport = (tripId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => logisticsService.deleteTransport(tripId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSPORTS_KEY, tripId] });
      queryClient.invalidateQueries({ queryKey: ["itinerary-items", tripId] });
    },
  });
};

export const useDeleteInventory = (tripId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => logisticsService.deleteInventory(tripId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVENTORY_KEY, tripId] });
    },
  });
};
