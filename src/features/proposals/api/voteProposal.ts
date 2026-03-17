import { doc, runTransaction } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Proposal, ProposalType } from "../types";
import { getProposalCollectionPath } from "../utils/paths";

export type VoteType = "rsvp" | "option";

export const voteProposal = async ({
  tripId,
  proposalId,
  userId,
  voteType,
  voteValue,
  type,
}: {
  tripId: string;
  proposalId: string;
  userId: string;
  voteType: VoteType;
  voteValue: string; // "si" | "no" | "maybe" for rsvp, or option label for option
  type: ProposalType;
}) => {
  const proposalRef = doc(
    db,
    getProposalCollectionPath(tripId, type),
    proposalId,
  );

  await runTransaction(db, async (transaction) => {
    const docSnap = await transaction.get(proposalRef);
    if (!docSnap.exists()) {
      throw new Error("Proposal does not exist!");
    }

    const proposal = docSnap.data() as Proposal;

    const updateData: Partial<Proposal> = {};

    if (voteType === "option") {
      const currentOptionVotes = { ...(proposal.optionVotes || {}) };

      // Remove user from any other option (mutually exclusive within options)
      for (const opt of Object.keys(currentOptionVotes)) {
        currentOptionVotes[opt] = (currentOptionVotes[opt] || []).filter(
          (id: string) => id !== userId,
        );
      }

      // Add user to the new option
      if (!currentOptionVotes[voteValue]) {
        currentOptionVotes[voteValue] = [];
      }
      if (!currentOptionVotes[voteValue].includes(userId)) {
        currentOptionVotes[voteValue].push(userId);
      }
      updateData.optionVotes = currentOptionVotes;
    } else if (voteType === "rsvp") {
      const currentVotes = { ...(proposal.votes || {}) };
      currentVotes[userId] = voteValue;
      updateData.votes = currentVotes;
    }

    transaction.update(proposalRef, updateData);
  });
};
