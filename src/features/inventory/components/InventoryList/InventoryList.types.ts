export type InventoryListProps = {
  tripId: string;
  currentUserId: string;
  isAdmin: boolean;
  onEdit: (item: any) => void;
  isPersonalFilter?: boolean;
};
