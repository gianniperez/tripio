import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ProposalStatus } from "@/features/proposals/types";
import { CreateActivityFormValues } from "../types";

export interface CreateActivityParams extends CreateActivityFormValues {
  tripId: string;
  userId: string;
}

export const createActivity = async ({
  tripId,
  userId,
  ...data
}: CreateActivityParams): Promise<string> => {
  const ref = doc(collection(db, `trips/${tripId}/activities`));

  const status: ProposalStatus =
    data.requiresVoting === false ? "confirmed" : "pending";

  await setDoc(ref, {
    type: "activity",
    title: data.title,
    description: data.description || null,
    estimatedCost: data.estimatedCost || null,
    location: data.location || null,
    startDate: data.startDate ? Timestamp.fromDate(data.startDate) : null,
    endDate: data.endDate ? Timestamp.fromDate(data.endDate) : null,
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
