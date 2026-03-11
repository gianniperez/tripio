import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TripSegment } from "@/types/tripio";

export const subscribeToTripSegments = (
  tripId: string,
  onUpdate: (segments: TripSegment[]) => void,
  onError: (error: Error) => void,
) => {
  const segmentsRef = collection(db, "trips", tripId, "segments");
  const q = query(segmentsRef, orderBy("order", "asc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const segments = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as TripSegment[];
      onUpdate(segments);
    },
    (error) => {
      console.error("Error subscribing to trip segments:", error);
      onError(error);
    },
  );
};
