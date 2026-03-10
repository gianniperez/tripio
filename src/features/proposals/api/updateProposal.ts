import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CreateProposalFormValues } from "../types";

export interface UpdateProposalParams extends Partial<CreateProposalFormValues> {
  tripId: string;
  proposalId: string;
}

export const updateProposal = async ({
  tripId,
  proposalId,
  ...data
}: UpdateProposalParams) => {
  const proposalRef = doc(db, "trips", tripId, "proposals", proposalId);

  await updateDoc(proposalRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });

  return proposalId;
};
