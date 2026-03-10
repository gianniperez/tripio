import { useQuery } from "@tanstack/react-query";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Proposal } from "@/types/tripio";

export const useProposals = (tripId: string) => {
  return useQuery({
    queryKey: ["proposals", tripId],
    queryFn: () => {
      return new Promise<Proposal[]>((resolve, reject) => {
        if (!tripId) {
          resolve([]);
          return;
        }
        
        const q = query(
          collection(db, "trips", tripId, "proposals")
        );
        
        onSnapshot(q, 
          (snapshot) => {
            const data = snapshot.docs.map(
              (doc) =>
                ({
                  id: doc.id,
                  ...doc.data(),
                } as Proposal)
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
