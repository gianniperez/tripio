"use client";

import { InputHTMLAttributes, useState, ReactNode, forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Eye, EyeOff } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NeumorphicInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const NeumorphicInput = forwardRef<
  HTMLInputElement,
  NeumorphicInputProps
>(({ label, error, className, type, leftIcon, rightIcon, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="font-display text-sm font-semibold ml-2 text-text-main">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-4 text-gray-400 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          type={inputType}
          className={cn(
            "bg-white rounded-tripio w-full px-4 py-3 shadow-neumorphic-inset focus:outline-none focus:ring-2 focus:ring-primary transition-all",
            "placeholder:text-gray-400 text-text-main",
            leftIcon && "pl-11",
            (rightIcon || isPassword) && "pr-11",
            error && "ring-2 ring-danger",
            className,
          )}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 text-gray-400 hover:text-primary transition-colors cursor-pointer"
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        ) : (
          rightIcon && (
            <div className="absolute right-4 text-gray-400 pointer-events-none">
              {rightIcon}
            </div>
          )
        )}
      </div>
      {error && <span className="text-danger text-xs ml-2">{error}</span>}
    </div>
  );
});

NeumorphicInput.displayName = "NeumorphicInput";
