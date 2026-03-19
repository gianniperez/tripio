import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTransport } from "../api";
import { useSyncTripSummary } from "@/features/trips/hooks";

export function useUpdateTransport(tripId: string) {
  const queryClient = useQueryClient();
  const { mutate: syncSummary } = useSyncTripSummary();

  return useMutation({
    mutationFn: (
      data: Omit<Parameters<typeof updateTransport>[0], "tripId">,
    ) => updateTransport({ ...data, tripId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals", tripId] });
      syncSummary(tripId);
    },
  });
}
