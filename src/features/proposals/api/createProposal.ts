import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CreateProposalFormValues, ProposalStatus } from "../types";

interface CreateProposalParams extends CreateProposalFormValues {
  tripId: string;
  userId: string;
}

export const createProposal = async ({
  tripId,
  userId,
  ...data
}: CreateProposalParams): Promise<string> => {
  const proposalRef = doc(collection(db, "trips", tripId, "proposals"));

  await setDoc(proposalRef, {
    ...data,
    status: "draft" as ProposalStatus,
    votes: {},
    optionVotes: data.options && data.options.length > 0 ? {} : null,
    linkedEventId: null,
    createdBy: userId,
    createdAt: serverTimestamp(),
  });

  return proposalRef.id;
};
