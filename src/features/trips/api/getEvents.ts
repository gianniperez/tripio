import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Event } from "@/types/tripio";

export const getEventsByTripId = (
  tripId: string,
  callback: (events: Event[]) => void,
  onError?: (error: Error) => void,
) => {
  const eventsRef = collection(db, "trips", tripId, "events");
  const q = query(
    eventsRef,
    orderBy("date", "asc"),
    orderBy("startTime", "asc"),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const events = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];
      callback(events);
    },
    (error) => {
      console.error("Firestore events query error:", error);
      if (onError) onError(error);
    },
  );
};
