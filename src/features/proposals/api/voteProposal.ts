import { doc, runTransaction } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Proposal } from "../types";

export type VoteType = "rsvp" | "option";

export const voteProposal = async ({
  tripId,
  proposalId,
  userId,
  voteType,
  voteValue,
}: {
  tripId: string;
  proposalId: string;
  userId: string;
  voteType: VoteType;
  voteValue: string; // "si" | "no" | "maybe" for rsvp, or option label for option
}) => {
  const proposalRef = doc(db, "trips", tripId, "proposals", proposalId);

  await runTransaction(db, async (transaction) => {
    const docSnap = await transaction.get(proposalRef);
    if (!docSnap.exists()) {
      throw new Error("Proposal does not exist!");
    }

    const proposal = docSnap.data() as Proposal;

    // Status transition: if it's the first vote, move from draft to voted
    let newStatus = proposal.status;
    if (proposal.status === "draft") {
      newStatus = "voted";
    }

    const updateData: Partial<Proposal> & { status: string } = {
      status: newStatus,
    };

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
