import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { costService } from "@/features/finances/api/costService";

const COSTS_KEY = "trip-costs";

export const useTripCosts = (tripId: string) => {
  return useQuery({
    queryKey: [COSTS_KEY, tripId],
    queryFn: () => costService.getTripCosts(tripId),
    enabled: !!tripId,
  });
};

export const useAddCost = (tripId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof costService.addCost>[2] & { userId: string }) => 
      costService.addCost(tripId, data.userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COSTS_KEY, tripId] });
    },
  });
};

export const useDeleteCost = (tripId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (costId: string) => costService.deleteCost(tripId, costId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COSTS_KEY, tripId] });
    },
  });
};
