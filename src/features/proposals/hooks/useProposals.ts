import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { subscribeToProposals } from "../api";
import { Proposal } from "../types";

export function useProposals(tripId: string) {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ["proposals", tripId], [tripId]);

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
    );

    return () => unsubscribe();
  }, [tripId, queryClient, queryKey]);

  return useQuery<Proposal[]>({
    queryKey,
    queryFn: () => queryClient.getQueryData(queryKey) ?? [],
    enabled: !!tripId,
    staleTime: Infinity,
  });
}
