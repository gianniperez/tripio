import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProposal } from "../api";

export function useCreateProposal(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Parameters<typeof createProposal>[0], "tripId">) =>
      createProposal({ ...data, tripId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals", tripId] });
    },
  });
}
