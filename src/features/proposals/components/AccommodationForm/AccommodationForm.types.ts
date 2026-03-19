import { Proposal } from "../../types";
import { CreateAccommodationFormValues } from "@/features/accommodation/types";
import { Trip } from "@/types/tripio";

export interface AccommodationFormProps {
  onSubmit: (data: CreateAccommodationFormValues) => void;
  isSubmitting?: boolean;
  initialData?: Proposal;
  tripId: string;
  trip: Trip;
  onClose?: () => void;
  isProposalMode?: boolean;
}
