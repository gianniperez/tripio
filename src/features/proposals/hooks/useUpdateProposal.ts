import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProposal, UpdateProposalParams } from "../api/updateProposal";

export const useUpdateProposal = (tripId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: Omit<UpdateProposalParams, "tripId">) =>
      updateProposal({ ...params, tripId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals", tripId] });
    },
  });
};
