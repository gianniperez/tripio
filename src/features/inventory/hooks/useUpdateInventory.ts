import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateInventoryItem } from "../api";
import { useSyncTripSummary } from "@/features/trips/hooks";

export function useUpdateInventory(tripId: string) {
  const queryClient = useQueryClient();
  const { mutate: syncSummary } = useSyncTripSummary();

  return useMutation({
    mutationFn: (
      data: Omit<Parameters<typeof updateInventoryItem>[0], "tripId">,
    ) => updateInventoryItem({ ...data, tripId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals", tripId] });
      syncSummary(tripId);
    },
  });
}
