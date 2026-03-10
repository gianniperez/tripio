import { useQuery } from "@tanstack/react-query";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Participant } from "@/types/tripio";

export const useParticipants = (tripId: string) => {
  return useQuery({
    queryKey: ["participants", tripId],
    queryFn: () => {
      return new Promise<Participant[]>((resolve, reject) => {
        if (!tripId) {
          resolve([]);
          return;
        }

        const q = query(
          collection(db, "trips", tripId, "participants")
        );

        onSnapshot(q, 
          (snapshot) => {
            const data = snapshot.docs.map(
              (doc) =>
                ({
                  id: doc.id,
                  ...doc.data(),
                } as Participant)
            );
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
      });
    },
    enabled: !!tripId,
  });
};
