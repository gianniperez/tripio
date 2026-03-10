import { ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NeumorphicCardProps {
  children: ReactNode;
  className?: string;
  variant?: "raised" | "sm";
}

export const NeumorphicCard = ({
  children,
  className,
  variant = "raised",
}: NeumorphicCardProps) => {
  return (
    <div
      className={cn(
        "bg-white rounded-tripio p-6",
        variant === "raised" ? "shadow-neumorphic" : "shadow-neumorphic-sm",
        className,
      )}
    >
      {children}
    </div>
  );
};
