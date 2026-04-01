import { z } from "zod";
import { Trip, Event, AccommodationConfirmed, TransportConfirmed } from "@/types/models";

// Tipos e interfaces globales para la feature trips

export type ItineraryItem =
  | { type: "activity"; id: string; date: Date; data: Event }
  | {
      type: "accommodation";
      id: string;
      date: Date;
      subType: "check-in" | "check-out";
      data: AccommodationConfirmed;
    }
  | {
      type: "transport";
      id: string;
      date: Date;
      subType: "departure" | "arrival";
      data: TransportConfirmed;
    };

export interface CreateTripInput {
  name: string;
  description?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  dailyBudget?: number;
  currency: string;
  coverImage?: string;
}

export const createTripSchema = z
  .object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    description: z.string().optional(),
    startDate: z
      .unknown()
      .optional()
      .transform((v: unknown) => {
        if (!v || v === "") return null;
        const date = new Date(v as string | number | Date);
        return isNaN(date.getTime()) ? null : date;
      }),
    endDate: z
      .unknown()
      .optional()
      .transform((v: unknown) => {
        if (!v || v === "") return null;
        const date = new Date(v as string | number | Date);
        return isNaN(date.getTime()) ? null : date;
      }),
    dailyBudget: z.number().min(0, "El presupuesto debe ser positivo").optional(),
    currency: z.string().min(1, "La moneda es requerida"),
    coverImage: z.string().optional(),
  })
  .refine((data) => !data.startDate || !!data.endDate, {
    message: "La fecha de fin es requerida si defines una fecha de inicio",
    path: ["endDate"],
  })
  .refine((data) => !data.endDate || !!data.startDate, {
    message: "La fecha de inicio es requerida si defines una fecha de fin",
    path: ["startDate"],
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return (data.endDate as Date) >= (data.startDate as Date);
      }
      return true;
    },
    {
      message: "La fecha de fin debe ser posterior a la de inicio",
      path: ["endDate"],
    }
  );

export interface TripWithRole extends Trip {
  userRole: string;
}

export const createActivitySchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  location: z.string().optional().nullable(),
  costImpact: z.number().min(0).optional().nullable(),
  date: z.date().optional().nullable(),
  startTime: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  requiresVoting: z.boolean(),
});

export type CreateActivityInput = z.infer<typeof createActivitySchema>;
