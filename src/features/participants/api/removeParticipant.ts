import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const removeParticipant = async (tripId: string, participantId: string): Promise<void> => {
  const participantRef = doc(db, "trips", tripId, "participants", participantId);
  await deleteDoc(participantRef);
};
