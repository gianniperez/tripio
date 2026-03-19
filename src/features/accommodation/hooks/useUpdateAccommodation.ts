import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAccommodation } from "../api";
import { useSyncTripSummary } from "@/features/trips/hooks";

export function useUpdateAccommodation(tripId: string) {
  const queryClient = useQueryClient();
  const { mutate: syncSummary } = useSyncTripSummary();

  return useMutation({
    mutationFn: (
      data: Omit<Parameters<typeof updateAccommodation>[0], "tripId">,
    ) => updateAccommodation({ ...data, tripId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals", tripId] });
      syncSummary(tripId);
    },
  });
}
