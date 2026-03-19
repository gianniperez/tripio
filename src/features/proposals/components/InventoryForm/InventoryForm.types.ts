import { Proposal } from "../../types";
import { CreateInventoryFormValues } from "@/features/inventory/types";
import { Trip } from "@/types/tripio";

export interface InventoryFormProps {
  onSubmit: (data: CreateInventoryFormValues) => void;
  isSubmitting?: boolean;
  initialData?: Proposal;
  tripId: string;
  trip: Trip;
  onClose?: () => void;
  defaultIsPersonal?: boolean;
  isProposalMode?: boolean;
}
