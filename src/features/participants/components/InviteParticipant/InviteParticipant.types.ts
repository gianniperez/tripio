import { Participant } from "@/types/tripio";

export type InviteParticipantProps = {
  onInvite: (role: Participant["role"]) => Promise<string | null>;
  isInviting: boolean;
};
