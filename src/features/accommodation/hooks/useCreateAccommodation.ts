import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAccommodation } from "../api";
import { useSyncTripSummary } from "@/features/trips/hooks";

export function useCreateAccommodation(tripId: string) {
  const queryClient = useQueryClient();
  const { mutate: syncSummary } = useSyncTripSummary();

  return useMutation({
    mutationFn: (
      data: Omit<Parameters<typeof createAccommodation>[0], "tripId">,
    ) => createAccommodation({ ...data, tripId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals", tripId] });
      syncSummary(tripId);
    },
  });
}
