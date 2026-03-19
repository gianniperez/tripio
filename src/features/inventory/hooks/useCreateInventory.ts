import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInventoryItem } from "../api";
import { useSyncTripSummary } from "@/features/trips/hooks";

export function useCreateInventory(tripId: string) {
  const queryClient = useQueryClient();
  const { mutate: syncSummary } = useSyncTripSummary();

  return useMutation({
    mutationFn: (
      data: Omit<Parameters<typeof createInventoryItem>[0], "tripId">,
    ) => createInventoryItem({ ...data, tripId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals", tripId] });
      syncSummary(tripId);
    },
  });
}
