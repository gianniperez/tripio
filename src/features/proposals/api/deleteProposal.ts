import {
  doc,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ProposalType } from "../types";
import { getProposalCollectionPath } from "../utils/paths";

export const deleteProposal = async ({
  tripId,
  proposalId,
  type,
}: {
  tripId: string;
  proposalId: string;
  type: ProposalType;
}) => {
  const batch = writeBatch(db);

  // 1. Delete the proposal itself
  const proposalRef = doc(
    db,
    getProposalCollectionPath(tripId, type),
    proposalId,
  );
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

  // 3. Delete linked events (activities)
  const eventsRef = collection(db, "trips", tripId, "activities");
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
