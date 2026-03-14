import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProposal, UpdateProposalParams } from "../api/updateProposal";
import { useSyncTripSummary } from "@/features/trips/hooks";

export const useUpdateProposal = (tripId: string) => {
  const queryClient = useQueryClient();
  const { mutate: syncSummary } = useSyncTripSummary();

  return useMutation({
    mutationFn: (params: Omit<UpdateProposalParams, "tripId">) =>
      updateProposal({ ...params, tripId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals", tripId] });
      syncSummary(tripId);
    },
  });
};
