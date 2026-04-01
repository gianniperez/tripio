import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { participantService } from "@/features/participants/api/participantService";

export const useParticipant = (tripId: string, userId: string) => {
  return useQuery({
    queryKey: ["participant", tripId, userId],
    queryFn: () => participantService.getParticipant(tripId, userId),
    enabled: !!tripId && !!userId,
  });
};

export const useUpdateParticipantBudget = (tripId: string, userId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (budgetLimit: number | null) => participantService.updateParticipantBudget(tripId, userId, budgetLimit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participant", tripId, userId] });
    }
  });
};
