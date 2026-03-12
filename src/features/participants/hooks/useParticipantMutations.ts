import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeParticipant } from "../api/removeParticipant";
import { createInvitation } from "../api/invitations";
import { TripRole } from "@/types/tripio";

export const useRemoveParticipant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tripId, participantId }: { tripId: string; participantId: string }) =>
      removeParticipant(tripId, participantId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["participants", variables.tripId] });
    },
  });
};

export const useInviteParticipant = (tripId: string, tripName: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ role, invitedByToken, invitedByName }: { role: TripRole; invitedByToken: string; invitedByName: string }) =>
      createInvitation(tripId, tripName, role, invitedByToken, invitedByName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations", tripId] });
    },
  });
};
