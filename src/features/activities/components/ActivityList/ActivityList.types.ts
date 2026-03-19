export type ActivityListProps = {
  tripId: string;
  currentUserId: string;
  isAdmin: boolean;
  onEdit: (item: any) => void;
};
