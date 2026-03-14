export type InputConfig = {
  name: string;
  label: string;
  type: "text" | "number" | "datetime-local" | "toggle" | "textarea" | "url";
  placeholder?: string;
  required?: boolean;
  gridCols?: number;
  showIf?: (values: any) => boolean;
};

export type FormType = {
  title: string;
  description: string;
  cta: string;
  inputs: InputConfig[];
  requiresVotingDefault?: boolean;
};
