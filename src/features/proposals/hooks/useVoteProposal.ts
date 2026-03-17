import { useMutation, useQueryClient } from "@tanstack/react-query";
import { VoteType, voteProposal } from "../api/voteProposal";
import { ProposalType } from "../types";
import { useSyncTripSummary } from "@/features/trips/hooks";

export function useVoteProposal(tripId: string) {
  const queryClient = useQueryClient();
  const { mutate: syncSummary } = useSyncTripSummary();

  return useMutation({
    mutationFn: (params: {
      proposalId: string;
      userId: string;
      voteType: VoteType;
      voteValue: string;
      type: ProposalType;
    }) => voteProposal({ ...params, tripId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals", tripId] });
      syncSummary(tripId);
    },
  });
}
