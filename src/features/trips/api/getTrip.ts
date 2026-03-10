import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trip } from "@/types/tripio";

export const getTripById = async (tripId: string): Promise<Trip | null> => {
  const tripRef = doc(db, "trips", tripId);
  const tripSnap = await getDoc(tripRef);

  if (!tripSnap.exists()) return null;

  return {
    id: tripSnap.id,
    ...tripSnap.data(),
  } as Trip;
};
