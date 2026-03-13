import { z } from "zod";
import { createTripSchema } from "../../types";

export type TripFormValues = z.input<typeof createTripSchema>;

export interface TripFormProps {
  onSubmit: (data: TripFormValues) => void;
  defaultValues?: Partial<TripFormValues>;
  isPending?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
}
