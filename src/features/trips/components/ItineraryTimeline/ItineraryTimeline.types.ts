import { ItineraryItem } from "../../types";

export interface ItineraryTimelineProps {
  tripId: string;
  items: ItineraryItem[];
  onItemClick?: (item: ItineraryItem) => void;
}
