import { useMutation, useQueryClient } from "@tanstack/react-query";
import { voteProposal } from "../api";

export function useVoteProposal(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Parameters<typeof voteProposal>[0], "tripId">) =>
      voteProposal({ ...data, tripId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals", tripId] });
    },
  });
}
