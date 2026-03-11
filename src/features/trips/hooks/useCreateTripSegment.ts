import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTripSegment } from "../api/createTripSegment";

export function useCreateTripSegment(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Omit<Parameters<typeof createTripSegment>[0], "tripId">,
    ) => createTripSegment({ ...data, tripId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tripSegments", tripId] });
    },
  });
}
