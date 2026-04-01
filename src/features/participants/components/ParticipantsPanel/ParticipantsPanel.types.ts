import { Participant, User } from "@/types/models";

export type ParticipantWithUser = Participant & Pick<User, "displayName" | "photoURL" | "email">;

export interface ParticipantsPanelProps {
  currentUserId: string;
  tripId: string;
  participants: ParticipantWithUser[];
}
