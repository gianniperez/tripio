import { useQuery } from "@tanstack/react-query";
import { participantService } from "@/features/participants/api/participantService";

export const useParticipants = (tripId: string) => {
  return useQuery({
    queryKey: ["participants", tripId],
    queryFn: () => participantService.getParticipants(tripId),
    enabled: !!tripId,
  });
};

/**
 * Hook global para buscar un participante por ID dentro de un viaje
 */
export const useParticipantById = (tripId: string, userId: string) => {
  const { data: participants, isLoading } = useParticipants(tripId);

  const participant = participants?.find((p) => p.id === userId);

  return {
    participant,
    isLoading,
    displayName: participant?.displayName || "Usuario Desconocido",
    photoURL: participant?.photoURL,
  };
};
