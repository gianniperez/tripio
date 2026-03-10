import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const deleteTrip = async (tripId: string): Promise<void> => {
  const tripRef = doc(db, "trips", tripId);
  // Note: This only deletes the parent document. 
  // In a robust production environment, a Cloud Function should handle
  // recursive deletion of all subcollections (proposals, events, costs, participants)
  // to avoid orphaned data. For MVP, deleting the main doc removes it from queries.
  await deleteDoc(tripRef);
};
