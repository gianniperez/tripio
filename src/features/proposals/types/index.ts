import { z } from "zod";
import { Timestamp } from "firebase/firestore";

export type ProposalType =
  | "accommodation"
  | "transport"
  | "activity"
  | "inventory";

export type ProposalStatus = "draft" | "voted" | "confirmed" | "rejected";

export interface Proposal {
  id: string;
  title: string;
  description: string | null;
  type: ProposalType;
  status: ProposalStatus;
  location: string | null;
  locationUrl: string | null;
  startDate: Timestamp | null;
  endDate: Timestamp | null;
  estimatedCost: number | null;
  accessible: boolean;
  referenceUrl: string | null;
  transportType: "personal" | "public" | null;
  capacity: number | null;
  quantity: number | null;
  /**
   * RSVP Votes (Interés General)
   * Record<userId, "si" | "no" | "maybe">
   */
  votes: Record<string, string>;
  options: string[] | null;
  /**
   * Specific Option Votes
   * Record<optionLabel, userId[]>
   */
  optionVotes: Record<string, string[]>;
  deadline: Timestamp | null;
  linkedEventId: string | null;
  createdBy: string;
  createdAt: Timestamp;
}

// Validation schemas for forms
export const createProposalSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().optional().nullable(),
  type: z.enum(["accommodation", "transport", "activity", "inventory"]),
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
    .min(0, "Costo no puede ser negativo")
    .optional()
    .nullable(),
  transportType: z.enum(["personal", "public"]).optional().nullable(),
  capacity: z.number().min(1).optional().nullable(),
  quantity: z.number().min(1).optional().nullable(),
  accessible: z.boolean().default(false).optional(),
  referenceUrl: z
    .string()
    .url("Debe ser una URL válida")
    .or(z.string().length(0))
    .optional()
    .nullable(),
  options: z.array(z.object({ value: z.string() })),
  deadline: z.date().optional().nullable(),
});

export type CreateProposalFormValues = z.infer<typeof createProposalSchema>;
