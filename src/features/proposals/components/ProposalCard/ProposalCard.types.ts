import type { UnifiedProposal } from "@/features/proposals/api/proposalsService";

export interface ProposalCardProps {
  proposal: UnifiedProposal;
  currentUserUid: string;
  canEdit: boolean;
  canConfirm: boolean;
  canVote: boolean;
  onEdit: (proposal: UnifiedProposal) => void;
  onDelete: (proposal: UnifiedProposal) => void;
  onConfirm: (proposal: UnifiedProposal) => void;
  onVote: (proposal: UnifiedProposal, vote: string) => void;
}
