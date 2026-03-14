import { ButtonHTMLAttributes, ReactNode } from "react";

export interface NeumorphicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "terciary" | "ghost" | "danger";
  className?: string;
  icon?: string;
}
