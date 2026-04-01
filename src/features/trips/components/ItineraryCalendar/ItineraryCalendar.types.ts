import { ItineraryItem } from "../../types";

export interface ItineraryCalendarProps {
  items: ItineraryItem[];
  onItemClick?: (item: ItineraryItem) => void;
  onDayClick?: (date: Date) => void;
}
