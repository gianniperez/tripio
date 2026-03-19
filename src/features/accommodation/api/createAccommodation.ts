import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ProposalStatus } from "@/features/proposals/types";
import { CreateAccommodationFormValues } from "../types";

export interface CreateAccommodationParams extends CreateAccommodationFormValues {
  tripId: string;
  userId: string;
}

export const createAccommodation = async ({
  tripId,
  userId,
  ...data
}: CreateAccommodationParams): Promise<string> => {
  const ref = doc(collection(db, `trips/${tripId}/accommodations`));

  const status: ProposalStatus =
    data.requiresVoting === false ? "confirmed" : "pending";

  await setDoc(ref, {
    type: "accommodation",
    title: data.title,
    description: data.description || null,
    location: data.location || null,
    locationUrl: data.locationUrl || null,
    startDate: data.startDate ? Timestamp.fromDate(data.startDate) : null,
    endDate: data.endDate ? Timestamp.fromDate(data.endDate) : null,
    estimatedCost: data.estimatedCost || null,
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
