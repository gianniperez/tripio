import {
  doc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const deleteProposal = async ({
  tripId,
  proposalId,
}: {
  tripId: string;
  proposalId: string;
}) => {
  const batch = writeBatch(db);

  // 1. Delete the proposal itself
  const proposalRef = doc(db, "trips", tripId, "proposals", proposalId);
  batch.delete(proposalRef);

  // 2. Delete linked costs
  const costsRef = collection(db, "trips", tripId, "costs");
  const costsQuery = query(
    costsRef,
    where("linkedProposalId", "==", proposalId),
  );
  const costsSnap = await getDocs(costsQuery);
  costsSnap.forEach((costDoc) => {
    batch.delete(costDoc.ref);
  });

  // 3. Delete linked events
  const eventsRef = collection(db, "trips", tripId, "events");
  const eventsQuery = query(
    eventsRef,
    where("linkedProposalId", "==", proposalId),
  );
  const eventsSnap = await getDocs(eventsQuery);
  eventsSnap.forEach((eventDoc) => {
    batch.delete(eventDoc.ref);
  });

  await batch.commit();
  return proposalId;
};
