import { useQuery } from "@tanstack/react-query";
import { tripService } from "@/features/trips/api/tripService";

export const useTrip = (tripId: string) => {
  return useQuery({
    queryKey: ["trip", tripId],
    queryFn: () => tripService.getTripById(tripId),
    enabled: !!tripId,
  });
};
