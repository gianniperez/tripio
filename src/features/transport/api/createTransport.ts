import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ProposalStatus } from "@/features/proposals/types";
import { CreateTransportFormValues } from "../types";

export interface CreateTransportParams extends CreateTransportFormValues {
  tripId: string;
  userId: string;
}

export const createTransport = async ({
  tripId,
  userId,
  ...data
}: CreateTransportParams): Promise<string> => {
  const ref = doc(collection(db, `trips/${tripId}/transports`));

  const status: ProposalStatus =
    data.requiresVoting === false ? "confirmed" : "pending";

  await setDoc(ref, {
    type: "transport",
    title: data.title,
    description: data.description || null,
    startDate: data.startDate ? Timestamp.fromDate(data.startDate) : null,
    endDate: data.endDate ? Timestamp.fromDate(data.endDate) : null,
    estimatedCost: data.estimatedCost || null,
    isPersonalTransport: data.isPersonalTransport ?? false,
    capacity: data.capacity || null,
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
