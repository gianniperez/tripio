import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectProposal } from "../api";

export function useRejectProposal(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Parameters<typeof rejectProposal>[0], "tripId">) =>
      rejectProposal({ ...data, tripId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals", tripId] });
    },
  });
}
