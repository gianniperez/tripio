import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confirmProposal } from "../api";

export function useConfirmProposal(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Parameters<typeof confirmProposal>[0], "tripId">) =>
      confirmProposal({ ...data, tripId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals", tripId] });
      queryClient.invalidateQueries({ queryKey: ["events", tripId] }); // Also invalidate events since it creates one
    },
  });
}
