import { 
  collection, 
  query, 
  onSnapshot 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Cost } from "@/types/tripio";

export const getCostsByTripId = (
  tripId: string, 
  callback: (costs: Cost[]) => void,
  onError?: (error: Error) => void
) => {
  const costsRef = collection(db, "trips", tripId, "costs");
  const q = query(costsRef);

  return onSnapshot(
    q, 
    (snapshot) => {
      const costs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Cost[];
      callback(costs);
    },
    (error) => {
      console.error("Firestore costs query error:", error);
      if (onError) onError(error);
    }
  );
};
