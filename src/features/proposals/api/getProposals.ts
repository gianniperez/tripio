import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Proposal } from "../types";

export const subscribeToProposals = (
  tripId: string,
  onUpdate: (proposals: Proposal[]) => void,
  onError: (error: Error) => void,
) => {
  const proposalsRef = collection(db, "trips", tripId, "proposals");
  const q = query(proposalsRef, orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const proposals: Proposal[] = [];
      snapshot.forEach((doc) => {
        proposals.push({ id: doc.id, ...doc.data() } as Proposal);
      });
      onUpdate(proposals);
    },
    onError,
  );
};
