export type AccommodationListProps = {
  tripId: string;
  currentUserId: string;
  isAdmin: boolean;
  onEdit: (item: any) => void;
};
