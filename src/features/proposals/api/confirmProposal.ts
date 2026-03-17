import {
  doc,
  collection,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Proposal, ProposalType } from "../types";
import {
  getProposalCollectionPath,
  getConfirmedCollectionPath,
} from "../utils/paths";

export const confirmProposal = async ({
  tripId,
  proposalId,
  userId,
  proposalType,
  winningOption,
}: {
  tripId: string;
  proposalId: string;
  userId: string;
  proposalType: ProposalType;
  winningOption?: string;
}) => {
  const proposalRef = doc(
    db,
    getProposalCollectionPath(tripId, proposalType),
    proposalId,
  );

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

    // Determine destination collection
    const confirmedPath = getConfirmedCollectionPath(tripId, proposalType);
    const sourcePath = getProposalCollectionPath(tripId, proposalType);

    // If unified collection, update in place. Otherwise, create new entity.
    const isUnified = confirmedPath === sourcePath;
    const newEntityId = isUnified
      ? proposalId
      : doc(collection(db, confirmedPath)).id;
    const newEntityRef = doc(db, confirmedPath, newEntityId);

    let newEventId: string | null = null;

    if (!isUnified) {
      // Legacy "move" logic
      if (proposal.type === "activity" && confirmedPath.endsWith("/events")) {
        newEventId = newEntityId;
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
        transaction.set(newEntityRef, eventData);
      } else if (proposal.type === "inventory") {
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
        transaction.set(newEntityRef, inventoryData);
      } else if (proposal.type === "transport") {
        const transportData = {
          name: finalTitle,
          type: proposal.isPersonalTransport ? "personal" : "public",
          capacity: proposal.capacity || 5,
          passengers: [],
          owner: null,
          createdBy: userId,
          createdAt: serverTimestamp(),
        };
        transaction.set(newEntityRef, transportData);
      } else if (proposal.type === "accommodation") {
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
        transaction.set(newEntityRef, accommodationData);
      }
    } else {
      // Unified module logic: just add specific confirmed fields if necessary
      // (Optional: map fields like 'status' of item sub-states if needed)
      if (proposal.type === "inventory") {
        proposalUpdateData.status = "confirmed"; // inventory uses confirmed too
      }
    }

    // Automatic cost creation when proposal has estimatedCost
    if (proposal.estimatedCost && proposal.estimatedCost > 0) {
      const costsRef = collection(db, "trips", tripId, "costs");
      const newCostRef = doc(costsRef);
      const costData = {
        description: finalTitle,
        amount: proposal.estimatedCost,
        category: (proposal.type === "logistics"
          ? proposal.subType
          : proposal.type) as any,
        linkedEventId: newEventId,
        linkedProposalId: proposalId,
        entityLink: {
          type: proposalType,
          id: newEntityId,
        },
        costType: "total" as const,
        splitType: "equal" as const,
        createdBy: userId,
        createdAt: serverTimestamp(),
      };
      transaction.set(newCostRef, costData);
    }

    transaction.update(proposalRef, proposalUpdateData);
  });
};
