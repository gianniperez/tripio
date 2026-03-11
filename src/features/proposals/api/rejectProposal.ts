import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const rejectProposal = async ({
  tripId,
  proposalId,
}: {
  tripId: string;
  proposalId: string;
}) => {
  const proposalRef = doc(db, "trips", tripId, "proposals", proposalId);
  await updateDoc(proposalRef, {
    status: "rejected",
    rejectedAt: serverTimestamp(),
  });
};
