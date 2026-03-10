import { Cost, Event, Proposal } from "@/types/tripio";

/**
 * Calculates the amount a single user is responsible for, for a specific cost.
 */
export const getUserCostAmount = (
  cost: Cost,
  events: Event[],
  proposals: Proposal[],
  userId: string,
): number => {
  // 1. Custom Split explicit overwrite
  if (
    cost.splitType === "custom" &&
    cost.customSplit &&
    cost.customSplit[userId] !== undefined
  ) {
    return cost.customSplit[userId];
  }

  // 2. Determine if user participates and get total participant count
  let userParticipates = false;
  let totalParticipants = 1;

  if (cost.linkedEventId) {
    const event = events.find((e) => e.id === cost.linkedEventId);
    if (event && event.rsvp) {
      userParticipates = event.rsvp[userId] === "si";
      totalParticipants = Object.values(event.rsvp).filter(
        (val) => val === "si",
      ).length;
    }
  } else if (cost.linkedProposalId) {
    const proposal = proposals.find((p) => p.id === cost.linkedProposalId);
    if (proposal && proposal.votes) {
      userParticipates = proposal.votes[userId] === "si";
      totalParticipants = Object.values(proposal.votes).filter(
        (val) => val === "si",
      ).length;
    }
  }

  // If user doesn't participate and wasn't manually assigned a split, cost is 0
  if (!userParticipates) {
    return 0;
  }

  // 3. Calculate based on costType
  if (cost.costType === "total") {
    // Prevent division by zero (though userParticipates implies at least 1)
    return cost.amount / Math.max(totalParticipants, 1);
  } else {
    // per_person
    return cost.amount;
  }
};

export const calculateMyCosts = (
  costs: Cost[],
  events: Event[],
  proposals: Proposal[],
  userId: string,
): number => {
  let total = 0;
  costs.forEach((cost) => {
    total += getUserCostAmount(cost, events, proposals, userId);
  });
  return total;
};

// Utilidad auxiliar para obtener solo los costos relevantes para el usuario
export const filterMyRelatedCosts = (
  costs: Cost[],
  events: Event[],
  proposals: Proposal[],
  userId: string,
): Cost[] => {
  return costs.filter((cost) => {
    // Consider a cost relevant if the user has an explicit split, OR if they participate.
    if (
      cost.splitType === "custom" &&
      cost.customSplit &&
      cost.customSplit[userId] !== undefined
    ) {
      return true;
    }

    if (cost.linkedEventId) {
      const event = events.find((e) => e.id === cost.linkedEventId);
      return event && event.rsvp && event.rsvp[userId] === "si";
    } else if (cost.linkedProposalId) {
      const proposal = proposals.find((p) => p.id === cost.linkedProposalId);
      return proposal && proposal.votes && proposal.votes[userId] === "si";
    }
    return false;
  });
};
