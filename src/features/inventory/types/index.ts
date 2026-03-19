import { z } from "zod";

export const createInventorySchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().optional().nullable(),
  estimatedCost: z
    .number()
    .nullable()
    .optional()
    .or(z.nan().transform(() => null)),
  quantity: z.number().nullable().optional().or(z.nan().transform(() => null)),
  assignedTo: z.string().optional().nullable(),
  isPersonal: z.boolean().default(true).optional(),
  inventoryCategory: z.string().optional().nullable(),
  responseType: z.enum(["rsvp", "poll"]).optional().nullable(),
  requiresVoting: z.boolean().default(true).optional(),
  options: z.array(z.object({ value: z.string() })).optional(),
});

export type CreateInventoryFormValues = z.infer<typeof createInventorySchema>;
