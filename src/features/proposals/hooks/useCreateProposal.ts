import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProposal } from "../api";
import { useSyncTripSummary } from "@/features/trips/hooks";

export function useCreateProposal(tripId: string) {
  const queryClient = useQueryClient();
  const { mutate: syncSummary } = useSyncTripSummary();

  return useMutation({
    mutationFn: (data: Omit<Parameters<typeof createProposal>[0], "tripId">) =>
      createProposal({ ...data, tripId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals", tripId] });
      syncSummary(tripId);
    },
  });
}
