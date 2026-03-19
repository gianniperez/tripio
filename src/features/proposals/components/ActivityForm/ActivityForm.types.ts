import { Proposal } from "../../types";
import { CreateActivityFormValues } from "@/features/activities/types";
import { Trip } from "@/types/tripio";

export interface ActivityFormProps {
  onSubmit: (data: CreateActivityFormValues) => void;
  isSubmitting?: boolean;
  initialData?: Proposal;
  tripId: string;
  trip: Trip;
  onClose?: () => void;
  isProposalMode?: boolean;
}
