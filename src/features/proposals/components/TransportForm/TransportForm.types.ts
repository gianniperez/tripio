import { Proposal } from "../../types";
import { CreateTransportFormValues } from "@/features/transport/types";
import { Trip } from "@/types/tripio";

export interface TransportFormProps {
  onSubmit: (data: CreateTransportFormValues) => void;
  isSubmitting?: boolean;
  initialData?: Proposal;
  tripId: string;
  trip: Trip;
  onClose?: () => void;
  isProposalMode?: boolean;
}
