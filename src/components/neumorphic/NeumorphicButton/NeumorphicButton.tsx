import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { NeumorphicButtonProps } from "./NeumorphicButton.types";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function NeumorphicButton({
  children,
  className,
  variant = "primary",
  disabled,
  ...props
}: NeumorphicButtonProps) {
  const variantStyles = {
    primary:
      "bg-primary text-white hover:bg-primary-dark active:bg-primary-deep",
    secondary:
      "bg-white text-text-main shadow-gray hover:shadow-gray-sm hover:bg-gray-100 active:shadow-gray-inset",
    terciary:
      "bg-secondary text-white hover:bg-secondary-dark active:bg-secondary-deep",
    ghost: "bg-transparent shadow-gray text-gray-500 hover:bg-black/5",
    danger:
      "bg-red-500 text-white shadow-gray hover:shadow-gray-sm active:shadow-gray-inset",
  };

  return (
    <button
      className={cn(
        "flex w-full gap-2 items-center justify-center cursor-pointer rounded-tripio px-6 py-4 font-display font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-center",
        variantStyles[variant],
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
