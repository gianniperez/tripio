import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAccommodation } from "../api";
import { useSyncTripSummary } from "@/features/trips/hooks";

export function useDeleteAccommodation(tripId: string) {
  const queryClient = useQueryClient();
  const { mutate: syncSummary } = useSyncTripSummary();

  return useMutation({
    mutationFn: (proposalId: string) =>
      deleteAccommodation({ tripId, proposalId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals", tripId] });
      syncSummary(tripId);
    },
  });
}
