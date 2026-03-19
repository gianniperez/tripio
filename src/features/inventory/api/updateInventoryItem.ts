import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CreateInventoryFormValues } from "../types";

export interface UpdateInventoryParams extends Partial<CreateInventoryFormValues> {
  tripId: string;
  proposalId: string;
}

export const updateInventoryItem = async ({
  tripId,
  proposalId,
  ...data
}: UpdateInventoryParams) => {
  const ref = doc(db, `trips/${tripId}/inventory`, proposalId);
  const updateData: Record<string, any> = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description || null;
  if (data.estimatedCost !== undefined) updateData.estimatedCost = data.estimatedCost || null;
  if (data.quantity !== undefined) updateData.quantity = data.quantity || null;
  if (data.assignedTo !== undefined) updateData.assignedTo = data.assignedTo || null;
  if (data.isPersonal !== undefined) updateData.isPersonal = data.isPersonal ?? true;
  if (data.inventoryCategory !== undefined) updateData.inventoryCategory = data.inventoryCategory || "General";
  if (data.options !== undefined)
    updateData.options = data.options?.map((o) => o.value) || null;
  if (data.responseType !== undefined)
    updateData.responseType = data.responseType || "rsvp";

  updateData.updatedAt = serverTimestamp();

  await updateDoc(ref, updateData);
  return proposalId;
};
