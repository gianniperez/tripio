import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { ProposalType } from "../types";
import { getProposalCollectionPath } from "../utils/paths";

export const rejectProposal = async ({
  tripId,
  proposalId,
  type,
}: {
  tripId: string;
  proposalId: string;
  type: ProposalType;
}) => {
  const proposalRef = doc(
    db,
    getProposalCollectionPath(tripId, type),
    proposalId,
  );
  await updateDoc(proposalRef, {
    status: "rejected",
    rejectedAt: serverTimestamp(),
  });
};
