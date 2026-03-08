import { Participant } from "@/types/tripio";

export type ParticipantsManagerProps = {
  participants: Participant[];
  currentUserId: string;
  onUpdateRole: (participantId: string, newRole: Participant["role"]) => void;
  onUpdatePermissions: (
    participantId: string,
    permissions: Participant["customPermissions"],
  ) => void;
  onRemoveParticipant: (participantId: string) => void;
  onInviteParticipant: (email: string, role: Participant["role"]) => void;
};
