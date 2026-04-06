import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Event } from "@/types/models";
import { toDate } from "@/utils/date-utils";

const EVENTS_KEY = "trip-events";

export const useEvents = (tripId: string) => {
  return useQuery({
    queryKey: [EVENTS_KEY, tripId],
    queryFn: async () => {
      const q = collection(db, `trips/${tripId}/events`);
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          date: toDate(data.date),
          startTime: toDate(data.startTime),
          endTime: toDate(data.endTime),
          createdAt: toDate(data.createdAt),
          updatedAt: toDate(data.updatedAt),
        } as Event;
      });
    },
    enabled: !!tripId,
  });
};
