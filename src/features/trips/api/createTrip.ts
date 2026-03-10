import {
  collection,
  doc,
  serverTimestamp,
  runTransaction,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Participant } from "@/types/tripio";

export interface CreateTripDTO {
  name: string;
  destination?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  currency: string;
  userId: string;
}

export const createTrip = async (data: CreateTripDTO): Promise<string> => {
  return await runTransaction(db, async (transaction) => {
    const tripsRef = collection(db, "trips");
    const newTripRef = doc(tripsRef);

    const tripData = {
      name: data.name,
      destination: data.destination || null,
      description: data.description || null,
      startDate: data.startDate || null,
      endDate: data.endDate || null,
      status: "planning",
      currency: data.currency,
      coverImage:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop",
      createdBy: data.userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    transaction.set(newTripRef, tripData);

    const participantRef = doc(
      db,
      "trips",
      newTripRef.id,
      "participants",
      data.userId,
    );
    const participantData: Omit<Participant, "id"> = {
      uid: data.userId,
      role: "owner",
      budgetLimit: null,
      joinedAt: serverTimestamp() as unknown as Timestamp,
      invitedBy: "system",
    };

    transaction.set(participantRef, participantData);

    return newTripRef.id;
  });
};
