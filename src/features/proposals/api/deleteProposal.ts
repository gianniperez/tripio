import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const deleteProposal = async ({
  tripId,
  proposalId,
}: {
  tripId: string;
  proposalId: string;
}) => {
  const proposalRef = doc(db, "trips", tripId, "proposals", proposalId);
  await deleteDoc(proposalRef);
  return proposalId;
};
