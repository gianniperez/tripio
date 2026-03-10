import { useState, useEffect } from "react";
import { Cost } from "@/types/tripio";
import { getCostsByTripId } from "../api/getCosts";

export const useCosts = (tripId: string | undefined) => {
  const [costs, setCosts] = useState<Cost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!tripId) return;

    try {
      const unsubscribe = getCostsByTripId(
        tripId,
        (data) => {
          setCosts(data);
          setIsLoading(false);
        },
        (err) => {
          setError(err);
          setIsLoading(false);
        },
      );
      return () => unsubscribe();
    } catch (err) {
      setTimeout(() => {
        setError(err as Error);
        setIsLoading(false);
      }, 0);
    }
  }, [tripId]);

  return { data: costs, isLoading, error };
};
