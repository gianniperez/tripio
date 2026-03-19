import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateActivity } from "../api";
import { useSyncTripSummary } from "@/features/trips/hooks";

export function useUpdateActivity(tripId: string) {
  const queryClient = useQueryClient();
  const { mutate: syncSummary } = useSyncTripSummary();

  return useMutation({
    mutationFn: (data: Omit<Parameters<typeof updateActivity>[0], "tripId">) =>
      updateActivity({ ...data, tripId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals", tripId] });
      syncSummary(tripId);
    },
  });
}
