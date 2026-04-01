import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tripService } from "@/features/trips/api/tripService";

export const useUpdateTripBudget = (tripId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (dailyBudget: number | null) => tripService.updateTripBudget(tripId, dailyBudget),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
    }
  });
};
