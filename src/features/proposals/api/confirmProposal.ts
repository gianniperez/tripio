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
  winningOption,
}: {
  tripId: string;
  proposalId: string;
  userId: string;
  winningOption?: string;
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

    // Determine final title (use winning option if provided for polls)
    const finalTitle = winningOption || proposal.title;

    // Prepare update data
    const proposalUpdateData: Partial<Proposal> = {
      status: "confirmed",
      title: finalTitle,
    };

    if (winningOption) {
      proposalUpdateData.winningOption = winningOption;
    }

    // Only create timeline events for types that are temporal (not inventory)
    const isTemporalType =
      proposal.type !== "inventory";

    let newEventId: string | null = null;

    if (isTemporalType) {
      const eventsRef = collection(db, "trips", tripId, "events");
      const newEventRef = doc(eventsRef);
      newEventId = newEventRef.id;

      const eventData = {
        title: finalTitle,
        description: proposal.description || null,
        date: proposal.startDate || serverTimestamp(),
        startTime: proposal.startDate || null,
        endTime: proposal.endDate || null,
        location: proposal.location || null,
        locationUrl: proposal.locationUrl || null,
        category: proposal.type,
        costImpact: proposal.estimatedCost || null,
        rsvp: proposal.votes || {},
        optionVotes: proposal.optionVotes || {},
        linkedProposalId: proposalId,
        createdBy: userId,
        createdAt: serverTimestamp(),
      };

      transaction.set(newEventRef, eventData);
    }

    // Logistical Side-Effects: "Conversión Mágica"
    if (proposal.type === "inventory") {
      const inventoryRef = collection(db, "trips", tripId, "inventory");
      const newItemRef = doc(inventoryRef);
      const inventoryData = {
        name: finalTitle,
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
        name: finalTitle,
        type: proposal.isPersonalTransport ? "personal" : "public",
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
        name: finalTitle,
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

    // Automatic cost creation when proposal has estimatedCost
    if (proposal.estimatedCost && proposal.estimatedCost > 0) {
      const costsRef = collection(db, "trips", tripId, "costs");
      const newCostRef = doc(costsRef);
      const costData = {
        description: finalTitle,
        amount: proposal.estimatedCost,
        category: proposal.type,
        linkedEventId: newEventId,
        linkedProposalId: proposalId,
        costType: "total" as const,
        splitType: "equal" as const,
        createdBy: userId,
        createdAt: serverTimestamp(),
      };
      transaction.set(newCostRef, costData);
    }

    // Link the created event back to the proposal (only if event was created)
    if (newEventId) {
      proposalUpdateData.linkedEventId = newEventId;
    }

    transaction.update(proposalRef, proposalUpdateData);
  });
};
