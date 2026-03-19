import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ProposalStatus } from "@/features/proposals/types";
import { CreateInventoryFormValues } from "../types";

export interface CreateInventoryParams extends CreateInventoryFormValues {
  tripId: string;
  userId: string;
}

export const createInventoryItem = async ({
  tripId,
  userId,
  ...data
}: CreateInventoryParams): Promise<string> => {
  const ref = doc(collection(db, `trips/${tripId}/inventory`));

  const status: ProposalStatus =
    data.requiresVoting === false ? "confirmed" : "pending";

  await setDoc(ref, {
    type: "inventory",
    title: data.title,
    description: data.description || null,
    estimatedCost: data.estimatedCost || null,
    quantity: data.quantity || 1,
    assignedTo: data.isPersonal ? null : data.assignedTo || null,
    isPersonal: data.isPersonal ?? true,
    inventoryCategory: data.inventoryCategory || "General",
    requiresVoting: data.requiresVoting ?? true,
    status,
    votes: {},
    optionVotes: data.options && data.options.length > 0 ? {} : null,
    options: data.options?.map((o) => o.value) || null,
    responseType: data.responseType || "rsvp",
    linkedEventId: null,
    createdBy: userId,
    createdAt: serverTimestamp(),
  });

  return ref.id;
};
