import { ButtonHTMLAttributes, ReactNode } from "react";

export interface NeumorphicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "tertiary" | "ghost" | "danger";
  className?: string;
}
