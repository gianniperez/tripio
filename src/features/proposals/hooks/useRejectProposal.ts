import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectProposal } from "../api";
import { useSyncTripSummary } from "@/features/trips/hooks";
import { ProposalType } from "../types";

export function useRejectProposal(tripId: string) {
  const queryClient = useQueryClient();
  const { mutate: syncSummary } = useSyncTripSummary();

  return useMutation({
    mutationFn: ({
      proposalId,
      type,
    }: {
      proposalId: string;
      type: ProposalType;
    }) => rejectProposal({ tripId, proposalId, type }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals", tripId] });
      syncSummary(tripId);
    },
  });
}
