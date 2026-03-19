import { z } from "zod";

export const createAccommodationSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  locationUrl: z
    .string()
    .url("Debe ser una URL válida")
    .or(z.string().length(0))
    .optional()
    .nullable(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  estimatedCost: z
    .number()
    .nullable()
    .optional()
    .or(z.nan().transform(() => null)),
  responseType: z.enum(["rsvp", "poll"]).optional().nullable(),
  requiresVoting: z.boolean().default(true).optional(),
  options: z.array(z.object({ value: z.string() })).optional(),
});

export type CreateAccommodationFormValues = z.infer<typeof createAccommodationSchema>;
