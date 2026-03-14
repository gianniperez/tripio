import { Proposal, CreateProposalFormValues, ProposalType } from "../../types";
import { Trip } from "@/types/tripio";

export interface LogisticsFormProps {
  onSubmit: (data: CreateProposalFormValues) => void;
  isSubmitting?: boolean;
  initialData?: Proposal;
  tripId: string;
  trip: Trip;
  onClose?: () => void;
  defaultType?: "accommodation" | "transport" | null;
  onTypeChange?: (type: "accommodation" | "transport") => void;
}
