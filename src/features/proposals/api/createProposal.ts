import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CreateProposalFormValues, ProposalStatus, Proposal } from "../types";

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

  const proposalData: Partial<Proposal> = {
    type: data.type,
    title: data.title,
    description: data.description || null,
    location: data.location || null,
    locationUrl: data.locationUrl || null,
    startDate: data.startDate ? Timestamp.fromDate(data.startDate) : null,
    endDate: data.endDate ? Timestamp.fromDate(data.endDate) : null,
    estimatedCost: data.estimatedCost || null,
    accessible: data.accessible || false,
    referenceUrl: data.referenceUrl || null,
    isPersonalTransport: data.isPersonalTransport ?? null,
    capacity: data.capacity || null,
    quantity: data.quantity || 1,
    assignedTo: data.assignedTo || null,
    options: data.options?.map((o) => o.value) || null,
    deadline: data.deadline ? Timestamp.fromDate(data.deadline) : null,
    segmentId: data.segmentId || null,
    responseType: data.responseType || "rsvp",
  };

  await setDoc(proposalRef, {
    ...proposalData,
    status: "draft" as ProposalStatus,
    votes: {},
    optionVotes: data.options && data.options.length > 0 ? {} : null,
    linkedEventId: null,
    createdBy: userId,
    createdAt: serverTimestamp(),
  });

  return proposalRef.id;
};
