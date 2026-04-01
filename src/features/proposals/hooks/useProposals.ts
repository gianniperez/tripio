import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { proposalsService, ProposalType } from "../api/proposalsService";

const PROPOSALS_KEY = "trip-proposals";

export const useAllProposals = (tripId: string) => {
  return useQuery({
    queryKey: [PROPOSALS_KEY, tripId],
    queryFn: async () => {
      try {
        const data = await proposalsService.getAllProposals(tripId);
        return data;
      } catch (err) {
        console.error("Error fetching proposals in React Query:", err);
        throw err;
      }
    },
    enabled: !!tripId,
  });
};

export const useCreateProposal = (tripId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, userId, data }: { type: ProposalType, userId: string, data: any }) => 
      proposalsService.createProposal(tripId, type, userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROPOSALS_KEY, tripId] });
    },
  });
};

export const useUpdateProposal = (tripId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, proposalId, data }: { type: ProposalType, proposalId: string, data: any }) => 
      proposalsService.updateProposal(tripId, type, proposalId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROPOSALS_KEY, tripId] });
    },
  });
};


export const useVoteProposal = (tripId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, proposalId, userId, vote }: { type: ProposalType, proposalId: string, userId: string, vote: string }) => 
      proposalsService.voteProposal(tripId, type, proposalId, userId, vote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROPOSALS_KEY, tripId] });
    },
  });
};

export const useDeleteProposal = (tripId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, proposalId }: { type: ProposalType, proposalId: string }) => 
      proposalsService.deleteProposal(tripId, type, proposalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROPOSALS_KEY, tripId] });
    },
  });
};

export const useConfirmProposal = (tripId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, proposalId, rawData }: { type: ProposalType, proposalId: string, rawData: any }) => 
      proposalsService.confirmProposal(tripId, type, proposalId, rawData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROPOSALS_KEY, tripId] });
      // We also invalidate itinerary items because confirming shifts items to timeline or logistics
      queryClient.invalidateQueries({ queryKey: ["itinerary-items", tripId] });
      queryClient.invalidateQueries({ queryKey: ["backlog-activities", tripId] });
    },
  });
};

