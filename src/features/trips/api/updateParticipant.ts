import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Participant } from "@/types/tripio";

export interface UpdateParticipantParams {
  tripId: string;
  participantId: string;
  data: Partial<Participant>;
}

export const updateParticipant = async ({
  tripId,
  participantId,
  data,
}: UpdateParticipantParams): Promise<void> => {
  const participantRef = doc(
    db,
    "trips",
    tripId,
    "participants",
    participantId,
  );
  await updateDoc(participantRef, data);
};
