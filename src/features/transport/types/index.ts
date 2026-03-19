import { z } from "zod";

export const createTransportSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().optional().nullable(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  estimatedCost: z
    .number()
    .nullable()
    .optional()
    .or(z.nan().transform(() => null)),
  isPersonalTransport: z.boolean().default(false).optional(),
  capacity: z.number().nullable().optional().or(z.nan().transform(() => null)),
  responseType: z.enum(["rsvp", "poll"]).optional().nullable(),
  requiresVoting: z.boolean().default(true).optional(),
  options: z.array(z.object({ value: z.string() })).optional(),
});

export type CreateTransportFormValues = z.infer<typeof createTransportSchema>;
