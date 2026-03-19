import { Proposal } from "@/features/proposals/types";

export type AccommodationCardProps = {
  item: Proposal;
  canManage: boolean;
  onEdit: () => void;
  onDelete: () => void;
  userProfiles: Record<string, string>;
};
