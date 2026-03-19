import {
  doc,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const deleteTransport = async ({
  tripId,
  proposalId,
}: {
  tripId: string;
  proposalId: string;
}) => {
  const batch = writeBatch(db);

  const ref = doc(db, `trips/${tripId}/transports`, proposalId);
  batch.delete(ref);

  const costsRef = collection(db, "trips", tripId, "costs");
  const costsQuery = query(
    costsRef,
    where("linkedProposalId", "==", proposalId),
  );
  const costsSnap = await getDocs(costsQuery);
  costsSnap.forEach((costDoc) => {
    batch.delete(costDoc.ref);
  });

  await batch.commit();
  return proposalId;
};
