import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProposal } from "../api/deleteProposal";
import { useSyncTripSummary } from "@/features/trips/hooks";
import { ProposalType } from "../types";

export const useDeleteProposal = (tripId: string) => {
  const queryClient = useQueryClient();
  const { mutate: syncSummary } = useSyncTripSummary();

  return useMutation({
    mutationFn: ({
      proposalId,
      type,
    }: {
      proposalId: string;
      type: ProposalType;
    }) => deleteProposal({ tripId, proposalId, type }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals", tripId] });
      syncSummary(tripId);
    },
  });
};
