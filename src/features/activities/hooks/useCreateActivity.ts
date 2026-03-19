import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createActivity } from "../api";
import { useSyncTripSummary } from "@/features/trips/hooks";

export function useCreateActivity(tripId: string) {
  const queryClient = useQueryClient();
  const { mutate: syncSummary } = useSyncTripSummary();

  return useMutation({
    mutationFn: (data: Omit<Parameters<typeof createActivity>[0], "tripId">) =>
      createActivity({ ...data, tripId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals", tripId] });
      syncSummary(tripId);
    },
  });
}
