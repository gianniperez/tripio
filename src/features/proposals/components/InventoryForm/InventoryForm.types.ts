import { Proposal, CreateProposalFormValues } from "../../types";
import { Trip } from "@/types/tripio";

export interface InventoryFormProps {
  onSubmit: (data: CreateProposalFormValues) => void;
  isSubmitting?: boolean;
  initialData?: Proposal;
  tripId: string;
  trip: Trip;
  onClose?: () => void;
  defaultIsPersonal?: boolean;
}
