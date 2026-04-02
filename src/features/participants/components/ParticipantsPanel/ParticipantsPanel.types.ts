import { ParticipantWithUser } from "../../types";

export interface ParticipantsPanelProps {
  currentUserId: string;
  tripId: string;
  participants: ParticipantWithUser[];
}
