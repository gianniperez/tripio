import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProposal } from "../api/deleteProposal";
import { useSyncTripSummary } from "@/features/trips/hooks";

export const useDeleteProposal = (tripId: string) => {
  const queryClient = useQueryClient();
  const { mutate: syncSummary } = useSyncTripSummary();

  return useMutation({
    mutationFn: (proposalId: string) => deleteProposal({ tripId, proposalId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals", tripId] });
      syncSummary(tripId);
    },
  });
};
