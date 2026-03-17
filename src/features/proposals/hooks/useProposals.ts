import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { subscribeToProposals } from "../api";
import { Proposal, ProposalType } from "../types";

export function useProposals(tripId: string, type?: ProposalType | "all") {
  const queryClient = useQueryClient();
  const queryKey = useMemo(
    () => ["proposals", tripId, type || "all"],
    [tripId, type],
  );

  useEffect(() => {
    if (!tripId) return;

    const unsubscribe = subscribeToProposals(
      tripId,
      (proposals) => {
        queryClient.setQueryData(queryKey, proposals);
      },
      (error) => {
        console.error("Error subscribing to proposals:", error);
      },
      type,
    );

    return () => unsubscribe();
  }, [tripId, queryClient, queryKey, type]);

  return useQuery<Proposal[]>({
    queryKey,
    queryFn: () => queryClient.getQueryData(queryKey) ?? [],
    enabled: !!tripId,
    staleTime: Infinity,
  });
}
