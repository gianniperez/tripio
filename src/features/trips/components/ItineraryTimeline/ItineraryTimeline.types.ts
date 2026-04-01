import { ItineraryItem } from "../../types";

export interface ItineraryTimelineProps {
  items: ItineraryItem[];
  onItemClick?: (item: ItineraryItem) => void;
}
