import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectProposal } from "../api";
import { useSyncTripSummary } from "@/features/trips/hooks";

export function useRejectProposal(tripId: string) {
  const queryClient = useQueryClient();
  const { mutate: syncSummary } = useSyncTripSummary();

  return useMutation({
    mutationFn: (data: Omit<Parameters<typeof rejectProposal>[0], "tripId">) =>
      rejectProposal({ ...data, tripId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals", tripId] });
      syncSummary(tripId);
    },
  });
}
