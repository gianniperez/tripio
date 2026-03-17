import { doc, updateDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CreateProposalFormValues, Proposal, ProposalType } from "../types";
import { getProposalCollectionPath } from "../utils/paths";

export interface UpdateProposalParams extends Partial<CreateProposalFormValues> {
  tripId: string;
  proposalId: string;
  type: ProposalType;
}

export const updateProposal = async ({
  tripId,
  proposalId,
  type,
  ...data
}: UpdateProposalParams) => {
  const proposalRef = doc(
    db,
    getProposalCollectionPath(tripId, type),
    proposalId,
  );

  const updateData: Partial<Proposal> = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined)
    updateData.description = data.description || null;
  if (data.location !== undefined) updateData.location = data.location || null;
  if (data.locationUrl !== undefined)
    updateData.locationUrl = data.locationUrl || null;
  if (data.startDate !== undefined)
    updateData.startDate = data.startDate
      ? Timestamp.fromDate(data.startDate)
      : null;
  if (data.endDate !== undefined)
    updateData.endDate = data.endDate ? Timestamp.fromDate(data.endDate) : null;
  if (data.estimatedCost !== undefined)
    updateData.estimatedCost = data.estimatedCost || null;
  if (data.accessible !== undefined) updateData.accessible = data.accessible;
  if (data.referenceUrl !== undefined)
    updateData.referenceUrl = data.referenceUrl || null;
  if (data.isPersonalTransport !== undefined)
    updateData.isPersonalTransport = data.isPersonalTransport ?? null;
  if (data.capacity !== undefined) updateData.capacity = data.capacity || null;
  if (data.quantity !== undefined) updateData.quantity = data.quantity || null;
  if (data.assignedTo !== undefined)
    updateData.assignedTo = data.assignedTo || null;
  if (data.options !== undefined)
    updateData.options = data.options?.map((o) => o.value) || null;
  if (data.deadline !== undefined)
    updateData.deadline = data.deadline
      ? Timestamp.fromDate(data.deadline)
      : null;
  if (data.segmentId !== undefined)
    updateData.segmentId = data.segmentId || null;
  if (data.responseType !== undefined)
    updateData.responseType = data.responseType || "rsvp";

  await updateDoc(proposalRef, {
    ...updateData,
    updatedAt: serverTimestamp(),
  });

  return proposalId;
};
