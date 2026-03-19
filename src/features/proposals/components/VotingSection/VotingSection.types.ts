import {
  Control,
  UseFormRegister,
  UseFormWatch,
  FieldErrors,
  FieldValues,
} from "react-hook-form";

export interface BaseProposalFields extends FieldValues {
  requiresVoting?: boolean;
  responseType?: "rsvp" | "poll" | null;
  options?: { value: string }[];
}

export interface VotingSectionProps<T extends BaseProposalFields> {
  register: UseFormRegister<T>;
  control: Control<T>;
  watch: UseFormWatch<T>;
  errors: FieldErrors<T>;
  isProposalMode?: boolean;
}
