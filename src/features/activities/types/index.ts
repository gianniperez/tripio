import { z } from "zod";

export const createActivitySchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().optional().nullable(),
  estimatedCost: z
    .number()
    .nullable()
    .optional()
    .or(z.nan().transform(() => null)),
  location: z.string().optional().nullable(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  responseType: z.enum(["rsvp", "poll"]).optional().nullable(),
  requiresVoting: z.boolean().default(true).optional(),
  options: z.array(z.object({ value: z.string() })).optional(),
});

export type CreateActivityFormValues = z.infer<typeof createActivitySchema>;
