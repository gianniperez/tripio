import { Event } from "@/types/models";

export interface ItineraryBacklogProps {
  activities: Event[];
  onAssignDate?: (activity: Event) => void;
}
