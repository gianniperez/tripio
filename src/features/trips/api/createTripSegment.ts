import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TripSegmentFormValues } from "../types/segment";

interface CreateTripSegmentParams extends TripSegmentFormValues {
  tripId: string;
  userId: string;
}

export const createTripSegment = async ({
  tripId,
  userId,
  ...data
}: CreateTripSegmentParams): Promise<string> => {
  const segmentRef = doc(collection(db, "trips", tripId, "segments"));

  await setDoc(segmentRef, {
    ...data,
    createdBy: userId,
    createdAt: serverTimestamp(),
  });

  return segmentRef.id;
};
