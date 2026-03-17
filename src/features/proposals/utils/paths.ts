import { ProposalType } from "../types";

export const getProposalCollectionPath = (
  tripId: string,
  type: ProposalType,
) => {
  switch (type) {
    case "activity":
      return `trips/${tripId}/activities`;
    case "accommodation":
    case "transport":
    case "inventory":
      return `trips/${tripId}/logistics`;
    default:
      return `trips/${tripId}/proposals`; // Fallback to legacy
  }
};

/**
 * @deprecated Proposals and confirmed items now live in the same collection.
 * Use getProposalCollectionPath instead.
 */
export const getConfirmedCollectionPath = (
  tripId: string,
  type: ProposalType,
) => {
  return getProposalCollectionPath(tripId, type);
};
