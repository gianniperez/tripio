import { z } from "zod";
import { TripSegment } from "@/types/tripio";

export const tripSegmentSchema = z.object({
  name: z.string().min(1, "El nombre del tramo es obligatorio"),
  destination: z.string().optional().nullable(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  accommodationId: z.string().optional().nullable(), // For Linking later
  transportId: z.string().optional().nullable(),
  order: z.number().default(0),
});

export type TripSegmentFormValues = z.infer<typeof tripSegmentSchema>;
export type { TripSegment };
