import { doc, updateDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CreateAccommodationFormValues } from "../types";

export interface UpdateAccommodationParams extends Partial<CreateAccommodationFormValues> {
  tripId: string;
  proposalId: string;
}

export const updateAccommodation = async ({
  tripId,
  proposalId,
  ...data
}: UpdateAccommodationParams) => {
  const ref = doc(db, `trips/${tripId}/accommodations`, proposalId);
  const updateData: Record<string, any> = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description || null;
  if (data.location !== undefined) updateData.location = data.location || null;
  if (data.locationUrl !== undefined) updateData.locationUrl = data.locationUrl || null;
  if (data.startDate !== undefined)
    updateData.startDate = data.startDate ? Timestamp.fromDate(data.startDate) : null;
  if (data.endDate !== undefined)
    updateData.endDate = data.endDate ? Timestamp.fromDate(data.endDate) : null;
  if (data.estimatedCost !== undefined) updateData.estimatedCost = data.estimatedCost || null;
  if (data.options !== undefined)
    updateData.options = data.options?.map((o) => o.value) || null;
  if (data.responseType !== undefined)
    updateData.responseType = data.responseType || "rsvp";

  updateData.updatedAt = serverTimestamp();

  await updateDoc(ref, updateData);
  return proposalId;
};
