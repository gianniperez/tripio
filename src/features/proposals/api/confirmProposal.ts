import {
  doc,
  collection,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Proposal } from "../types";

export const confirmProposal = async ({
  tripId,
  proposalId,
  userId,
}: {
  tripId: string;
  proposalId: string;
  userId: string;
}) => {
  const proposalRef = doc(db, "trips", tripId, "proposals", proposalId);

  await runTransaction(db, async (transaction) => {
    const docSnap = await transaction.get(proposalRef);
    if (!docSnap.exists()) {
      throw new Error("Proposal does not exist!");
    }

    const proposal = docSnap.data() as Proposal;

    if (proposal.status === "confirmed") {
      return; // Already confirmed
    }

    // Prepare update data
    const proposalUpdateData: Partial<Proposal> = {
      status: "confirmed",
    };

    // If it's a structural proposal, we create an Event in the Timeline.
    // Events handle 'accommodation', 'transport', 'food', 'activity', 'inventory', 'other'
    // We treat everything as structural now since they are unified.
    const eventsRef = collection(db, "trips", tripId, "events");
    const newEventRef = doc(eventsRef);

    // Map optionVotes to a flatter structure or just pass them if the event supports them
    // For MVP, we'll store the results in a 'metadata' or similar field if needed,
    // but the current 'rsvp' field was boolean. We'll add 'optionVotes' to events too.
    const eventData = {
      title: proposal.title,
      description: proposal.description || null,
      date: proposal.startDate || serverTimestamp(),
      startTime: proposal.startDate || null,
      endTime: proposal.endDate || null,
      location: proposal.location || null,
      locationUrl: proposal.locationUrl || null,
      category: proposal.type,
      costImpact: proposal.estimatedCost || null,
      // For backward compatibility keep rsvp, but add optionVotes
      rsvp: proposal.votes || {},
      optionVotes: proposal.optionVotes || {},
      linkedProposalId: proposalId,
      createdBy: userId,
      createdAt: serverTimestamp(),
    };

    transaction.set(newEventRef, eventData);

    transaction.set(newEventRef, eventData);

    // Logistical Side-Effects: "Conversión Mágica"
    if (proposal.type === "inventory") {
      const inventoryRef = collection(db, "trips", tripId, "inventory");
      const newItemRef = doc(inventoryRef);
      const inventoryData = {
        name: proposal.title,
        description: proposal.description || null,
        quantity: proposal.quantity || 1,
        detail: proposal.description || null,
        assignedTo: null,
        status: "needed",
        linkedTaskId: null,
        createdBy: userId,
        createdAt: serverTimestamp(),
      };
      transaction.set(newItemRef, inventoryData);
    } else if (proposal.type === "transport") {
      const transportRef = collection(db, "trips", tripId, "transport");
      const newItemRef = doc(transportRef);
      const transportData = {
        name: proposal.title,
        type: proposal.transportType || "personal",
        capacity: proposal.capacity || 5,
        passengers: [],
        owner: null,
        createdBy: userId,
        createdAt: serverTimestamp(),
      };
      transaction.set(newItemRef, transportData);
    } else if (proposal.type === "accommodation") {
      const accommodationRef = collection(
        db,
        "trips",
        tripId,
        "accommodations",
      );
      const newItemRef = doc(accommodationRef);
      const accommodationData = {
        name: proposal.title,
        description: proposal.description || null,
        location: proposal.location || null,
        locationUrl: proposal.locationUrl || null,
        checkIn: proposal.startDate || null,
        checkOut: proposal.endDate || null,
        cost: proposal.estimatedCost || null,
        createdBy: userId,
        createdAt: serverTimestamp(),
      };
      transaction.set(newItemRef, accommodationData);
    }

    // Link the created event back to the proposal
    proposalUpdateData.linkedEventId = newEventRef.id;

    transaction.update(proposalRef, proposalUpdateData);
  });
};
