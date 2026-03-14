import { useMutation, useQueryClient } from "@tanstack/react-query";
import { syncTripSummary } from "../api/syncTripSummary";

export const useSyncTripSummary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tripId: string) => syncTripSummary(tripId),
    onSuccess: (_, tripId) => {
      // Invalidar la query del viaje para que los widgets se actualicen con el nuevo summary
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });
};
