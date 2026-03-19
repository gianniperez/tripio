import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransport } from "../api";
import { useSyncTripSummary } from "@/features/trips/hooks";

export function useCreateTransport(tripId: string) {
  const queryClient = useQueryClient();
  const { mutate: syncSummary } = useSyncTripSummary();

  return useMutation({
    mutationFn: (
      data: Omit<Parameters<typeof createTransport>[0], "tripId">,
    ) => createTransport({ ...data, tripId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals", tripId] });
      syncSummary(tripId);
    },
  });
}
