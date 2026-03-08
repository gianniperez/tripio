import { Participant } from "@/types/tripio";

export type InviteParticipantProps = {
  onInvite: (email: string, role: Participant["role"]) => void;
  isInviting: boolean;
};
