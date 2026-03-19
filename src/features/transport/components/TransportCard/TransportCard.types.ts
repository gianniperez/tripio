import { Proposal } from "@/features/proposals/types";

export type TransportCardProps = {
  item: Proposal;
  canManage: boolean;
  onEdit: () => void;
  onDelete: () => void;
  userProfiles: Record<string, string>;
};
