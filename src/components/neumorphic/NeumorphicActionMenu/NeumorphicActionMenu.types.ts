import { ReactNode } from "react";

export interface MenuOption {
  label: string;
  onClick: (e: React.MouseEvent) => void;
  icon?: string;
  variant?: "default" | "danger";
}

export interface NeumorphicActionMenuProps {
  options: MenuOption[];
  trigger?: ReactNode;
  className?: string;
  align?: "left" | "right";
}
