import {
  Control,
  UseFormRegister,
  UseFormWatch,
  FieldErrors,
} from "react-hook-form";
import { CreateProposalFormValues } from "../../types";

export interface VotingSectionProps {
  register: UseFormRegister<CreateProposalFormValues>;
  control: Control<CreateProposalFormValues>;
  watch: UseFormWatch<CreateProposalFormValues>;
  errors: FieldErrors<CreateProposalFormValues>;
}
