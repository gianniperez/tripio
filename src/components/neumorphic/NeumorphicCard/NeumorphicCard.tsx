import { ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NeumorphicCardProps {
  children: ReactNode;
  className?: string;
  variant?: "cream" | "gray";
  onClick?: () => void;
}

export const NeumorphicCard = ({
  children,
  className,
  variant = "cream",
  onClick,
}: NeumorphicCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-tripio p-6",
        variant === "cream" ? "shadow-cream" : "shadow-gray",
        className,
      )}
    >
      {children}
    </div>
  );
};
