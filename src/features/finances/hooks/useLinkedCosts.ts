import { useMemo } from "react";
import { useTripCosts } from "./useCosts";

export const useLinkedCosts = (tripId: string, entityId: string | null) => {
  const { data: costs, isLoading } = useTripCosts(tripId);

  const linkedCosts = useMemo(() => {
    if (!costs || !entityId) return [];
    return costs.filter((c) => c.linkedTo === entityId);
  }, [costs, entityId]);

  const totalAmount = useMemo(() => {
    return linkedCosts.reduce((acc, c) => acc + c.amount, 0);
  }, [linkedCosts]);

  return {
    costs: linkedCosts,
    totalAmount,
    isLoading,
  };
};
