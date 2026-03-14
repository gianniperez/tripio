import { useMutation, useQueryClient } from "@tanstack/react-query";
import { voteProposal } from "../api";
import { useSyncTripSummary } from "@/features/trips/hooks";

export function useVoteProposal(tripId: string) {
  const queryClient = useQueryClient();
  const { mutate: syncSummary } = useSyncTripSummary();

  return useMutation({
    mutationFn: (data: Omit<Parameters<typeof voteProposal>[0], "tripId">) =>
      voteProposal({ ...data, tripId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals", tripId] });
      syncSummary(tripId);
    },
  });
}
