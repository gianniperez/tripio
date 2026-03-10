import { 
  doc, 
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trip } from "@/types/tripio";

export type UpdateTripDTO = Partial<Omit<Trip, "id" | "createdBy" | "createdAt" | "updatedAt">>;

export const updateTrip = async (tripId: string, data: UpdateTripDTO): Promise<void> => {
  const tripRef = doc(db, "trips", tripId);
  await updateDoc(tripRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};
