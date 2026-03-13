import { z } from "zod";

export const createTripSchema = z
  .object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    description: z.string().optional(),
    coverImage: z
      .string()
      .url("Debe ser una URL válida")
      .optional()
      .nullable()
      .or(z.literal("")),
    startDate: z
      .union([z.string(), z.date()])
      .optional()
      .transform((val) => {
        if (!val) return undefined;
        if (val instanceof Date) return val;
        const dateStr =
          typeof val === "string" && !val.includes("T")
            ? `${val}T12:00:00`
            : val;
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? undefined : d;
      }),
    endDate: z
      .union([z.string(), z.date()])
      .optional()
      .transform((val) => {
        if (!val) return undefined;
        if (val instanceof Date) return val;
        const dateStr =
          typeof val === "string" && !val.includes("T")
            ? `${val}T12:00:00`
            : val;
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? undefined : d;
      }),
    currency: z.string().min(1, "Debes seleccionar una moneda"),
    enabledFeatures: z
      .object({
        finances: z.boolean(),
        inventory: z.boolean(),
        activities: z.boolean(),
        logistics: z.boolean(),
      })
      .optional()
      .default({
        finances: true,
        inventory: true,
        activities: true,
        logistics: true,
      }),
  })
  .refine(
    (data) => {
      const start = data.startDate as Date | undefined;
      const end = data.endDate as Date | undefined;
      if (start && end) {
        return end >= start;
      }
      return true;
    },
    {
      message: "La fecha de fin no puede ser anterior a la de inicio",
      path: ["endDate"],
    },
  );

export type CreateTripFormValues = z.infer<typeof createTripSchema>;
