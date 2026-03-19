import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteInventoryItem } from "../api";
import { useSyncTripSummary } from "@/features/trips/hooks";

export function useDeleteInventory(tripId: string) {
  const queryClient = useQueryClient();
  const { mutate: syncSummary } = useSyncTripSummary();

  return useMutation({
    mutationFn: (proposalId: string) =>
      deleteInventoryItem({ tripId, proposalId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals", tripId] });
      syncSummary(tripId);
    },
  });
}
