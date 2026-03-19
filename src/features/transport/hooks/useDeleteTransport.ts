import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTransport } from "../api";
import { useSyncTripSummary } from "@/features/trips/hooks";

export function useDeleteTransport(tripId: string) {
  const queryClient = useQueryClient();
  const { mutate: syncSummary } = useSyncTripSummary();

  return useMutation({
    mutationFn: (proposalId: string) =>
      deleteTransport({ tripId, proposalId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals", tripId] });
      syncSummary(tripId);
    },
  });
}
