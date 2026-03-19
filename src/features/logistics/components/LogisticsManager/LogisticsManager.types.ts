import { Trip } from "@/types/tripio";
import { Proposal } from "@/features/proposals/types";
import { User } from "firebase/auth";

export type LogisticsManagerProps = {
  tripId: string;
  trip: Trip;
  user: User | null;
  isAdmin: boolean;
  onEdit: (proposal: Proposal) => void;
};
