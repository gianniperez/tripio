import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProposal } from "../api/deleteProposal";

export const useDeleteProposal = (tripId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (proposalId: string) => deleteProposal({ tripId, proposalId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals", tripId] });
    },
  });
};
