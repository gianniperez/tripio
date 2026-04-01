import { z } from "zod";

// ACCOMMODATION
export const accommodationSchema = z.object({
  title: z.string().min(3, "Mínimo 3 caracteres"),
  location: z.string().optional().nullable(),
  checkIn: z.string().min(1, "Campo requerido"),
  checkOut: z.string().min(1, "Campo requerido"),
  priceEstimate: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  requiresVoting: z.boolean().default(false),
});

export type AccommodationInput = z.infer<typeof accommodationSchema>;

// TRANSPORT
export const transportSchema = z.object({
  title: z.string().min(3, "Mínimo 3 caracteres"),
  departure: z.string().min(1, "Campo requerido"),
  arrival: z.string().min(1, "Campo requerido"),
  isPersonal: z.boolean().default(false),
  capacity: z.string().optional().nullable(),
  priceEstimate: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  requiresVoting: z.boolean().default(false),
});

export type TransportInput = z.infer<typeof transportSchema>;

// INVENTORY
export const inventorySchema = z.object({
  title: z.string().min(2, "Mínimo 2 caracteres"),
  category: z.string().default("general"),
  quantity: z.string().min(1, "Mínimo 1").default("1"),
  priceEstimate: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  requiresVoting: z.boolean().default(false),
});

export type InventoryInput = z.infer<typeof inventorySchema>;
