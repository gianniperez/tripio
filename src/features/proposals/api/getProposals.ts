import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Proposal, ProposalType } from "../types";
import { getProposalCollectionPath } from "../utils/paths";

export const subscribeToProposals = (
  tripId: string,
  onUpdate: (proposals: Proposal[]) => void,
  onError: (error: Error) => void,
  type?: ProposalType | "all",
) => {
  const types: ProposalType[] =
    !type || type === "all"
      ? ["activity", "accommodation"] // accommodation here represents the logistics group in paths.ts
      : [type as ProposalType];

  // If "all", we need to subscribe to both activities and logistics
  const paths =
    !type || type === "all"
      ? [`trips/${tripId}/activities`, `trips/${tripId}/logistics`]
      : [getProposalCollectionPath(tripId, type)];

  const unsubscribes: Unsubscribe[] = [];
  const results: Record<string, Proposal[]> = {};

  paths.forEach((path, index) => {
    const proposalsRef = collection(db, path);
    const q = query(proposalsRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const proposals: Proposal[] = [];
        snapshot.forEach((doc) => {
          proposals.push({ id: doc.id, ...doc.data() } as Proposal);
        });
        results[path] = proposals;

        // Merge and sort all results
        const merged = Object.values(results)
          .flat()
          .sort((a, b) => {
            const timeA = a.createdAt?.toMillis?.() || 0;
            const timeB = b.createdAt?.toMillis?.() || 0;
            return timeB - timeA;
          });
        onUpdate(merged);
      },
      onError,
    );
    unsubscribes.push(unsub);
  });

  return () => {
    unsubscribes.forEach((unsub) => unsub());
  };
};
