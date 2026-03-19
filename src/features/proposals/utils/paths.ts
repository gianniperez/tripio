import { ProposalType } from "../types";

export const getProposalCollectionPath = (
  tripId: string,
  type: ProposalType,
) => {
  switch (type) {
    case "activity":
      return `trips/${tripId}/activities`;
    case "accommodation":
      return `trips/${tripId}/accommodations`;
    case "transport":
      return `trips/${tripId}/transports`;
    case "inventory":
      return `trips/${tripId}/inventory`;
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
