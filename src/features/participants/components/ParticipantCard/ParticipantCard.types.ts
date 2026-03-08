import { Participant } from "@/types/tripio";

export type ParticipantCardProps = {
  participant: Participant;
  isCurrentUser: boolean;
  canManage: boolean; // Si el usuario activo (currentUserId) puede editar a este participante
  onUpdateRole: (newRole: Participant["role"]) => void;
  onUpdatePermissions: (permissions: Participant["customPermissions"]) => void;
  onRemove: () => void;
};
