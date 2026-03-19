import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteActivity } from "../api";
import { useSyncTripSummary } from "@/features/trips/hooks";

export function useDeleteActivity(tripId: string) {
  const queryClient = useQueryClient();
  const { mutate: syncSummary } = useSyncTripSummary();

  return useMutation({
    mutationFn: (proposalId: string) => deleteActivity({ tripId, proposalId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals", tripId] });
      syncSummary(tripId);
    },
  });
}
