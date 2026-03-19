import { doc, updateDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CreateTransportFormValues } from "../types";

export interface UpdateTransportParams extends Partial<CreateTransportFormValues> {
  tripId: string;
  proposalId: string;
}

export const updateTransport = async ({
  tripId,
  proposalId,
  ...data
}: UpdateTransportParams) => {
  const ref = doc(db, `trips/${tripId}/transports`, proposalId);
  const updateData: Record<string, any> = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description || null;
  if (data.startDate !== undefined)
    updateData.startDate = data.startDate ? Timestamp.fromDate(data.startDate) : null;
  if (data.endDate !== undefined)
    updateData.endDate = data.endDate ? Timestamp.fromDate(data.endDate) : null;
  if (data.estimatedCost !== undefined) updateData.estimatedCost = data.estimatedCost || null;
  if (data.isPersonalTransport !== undefined) updateData.isPersonalTransport = data.isPersonalTransport ?? false;
  if (data.capacity !== undefined) updateData.capacity = data.capacity || null;
  if (data.options !== undefined)
    updateData.options = data.options?.map((o) => o.value) || null;
  if (data.responseType !== undefined)
    updateData.responseType = data.responseType || "rsvp";

  updateData.updatedAt = serverTimestamp();

  await updateDoc(ref, updateData);
  return proposalId;
};
