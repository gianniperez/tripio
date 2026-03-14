"use client";

import { useState, forwardRef, useRef, useImperativeHandle } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Icon } from "@/components/ui/Icon";
import { NeumorphicInputProps } from "./NeumorphicInput.types";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const NeumorphicInput = forwardRef<
  HTMLInputElement | HTMLSelectElement,
  NeumorphicInputProps
>(
  (
    {
      label,
      error,
      className,
      type = "text",
      icon,
      iconPosition = "left",
      options = [],
      containerClassName,
      labelRightContent,
      helperText,
      required,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const isSelect = type === "select";
    const isNumber = type === "number";
    const isDate = type === "date" || type === "datetime-local";
    const isFile = type === "file";

    const [fileName, setFileName] = useState<string | null>(null);

    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    const innerRef = useRef<HTMLInputElement | HTMLSelectElement>(null);
    useImperativeHandle(ref, () => innerRef.current!);

    const handleIconClick = () => {
      if (isDate && innerRef.current && "showPicker" in innerRef.current) {
        try {
          (innerRef.current as HTMLInputElement).showPicker();
        } catch (e) {
          console.error("Error opening picker:", e);
        }
      }
    };

    // Default icon for date
    let renderedIcon = icon;
    let renderedIconPosition = iconPosition;

    if (isDate && !icon) {
      renderedIcon = <Icon name="calendar_month" size={20} />;
      renderedIconPosition = "right";
    }

    const baseInputStyles = cn(
      "bg-white rounded-tripio w-full px-4 py-3 border border-gray-200 shadow-gray-inset hover:outline-none hover:ring-2 hover:ring-secondary focus:outline-none focus:ring-2 focus:ring-secondary transition-all",
      "placeholder:text-gray-400 text-text-main select-text cursor-text",
      renderedIcon && renderedIconPosition === "left" && "pl-11",
      ((renderedIcon && renderedIconPosition === "right") ||
        isPassword ||
        isSelect ||
        isDate) &&
        "pr-11",
      error && "ring-2 ring-danger",
      isSelect && "appearance-none cursor-pointer",
      isNumber &&
        "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
      isDate &&
        "appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-clear-button]:appearance-none",
      type == "textarea" && "resize-none",
      className,
    );

    return (
      <div className={cn("flex flex-col gap-2 w-full", containerClassName)}>
        {(label || labelRightContent) && (
          <div className="flex items-center justify-between mb-1 px-2">
            {label && (
              <label className="font-display text-sm font-semibold text-text-main">
                {label}
                {required && (
                  <span className="text-danger ml-1" title="Campo obligatorio">
                    *
                  </span>
                )}
              </label>
            )}
            {labelRightContent}
          </div>
        )}
        <div className="relative flex items-center group">
          {renderedIcon && renderedIconPosition === "left" && (
            <div
              className={cn(
                "flex absolute left-4 text-gray-400 z-10 transition-colors",
                isDate &&
                  "group-hover:text-secondary group-focus-within:text-secondary",
                isDate ? "cursor-pointer" : "pointer-events-none",
              )}
              onClick={handleIconClick}
            >
              {renderedIcon}
            </div>
          )}

          {isSelect ? (
            <div className="relative w-full group">
              <select
                ref={innerRef as React.Ref<HTMLSelectElement>}
                className={baseInputStyles}
                {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
              >
                <option value="" disabled hidden>
                  {props.placeholder ?? "Indefinido"}
                </option>
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="flex absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-secondary group-focus:text-secondary pointer-events-none">
                <Icon name="expand_more" size={24} />
              </div>
            </div>
          ) : isFile ? (
            <div className="w-full">
              <input
                ref={innerRef as React.Ref<HTMLInputElement>}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setFileName(file ? file.name : null);
                  props.onChange?.(e as any);
                }}
                {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
              />
              <button
                type="button"
                onClick={() => (innerRef.current as HTMLInputElement)?.click()}
                className={cn(
                  "flex w-full gap-2 items-center justify-center cursor-pointer rounded-tripio px-6 py-4 font-display font-bold transition-all text-center",
                  "bg-secondary text-white hover:bg-secondary-dark active:shadow-secondary-inset shadow-secondary",
                  className
                )}
              >
                <Icon name={fileName ? "check_circle" : "cloud_upload"} size={20} />
                {fileName || props.placeholder || "Subir archivo"}
              </button>
            </div>
          ) : type === "textarea" ? (
            <textarea
              ref={innerRef as React.Ref<HTMLTextAreaElement>}
              className={cn(baseInputStyles, "min-h-[100px] rounded-3xl!")}
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <>
              <input
                ref={innerRef as React.Ref<HTMLInputElement>}
                type={inputType}
                className={baseInputStyles}
                required={required}
                placeholder={props.placeholder ?? (isNumber ? "0" : undefined)}
                onClick={(e) => {
                  if (isDate) handleIconClick();
                  props.onClick?.(e as any);
                }}
                {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
              />
              {((renderedIcon && renderedIconPosition === "right") ||
                (isDate && !renderedIcon)) &&
                !isPassword && (
                  <div
                    className={cn(
                      "flex absolute right-4 text-gray-400 z-10 transition-colors",
                      isDate &&
                        "group-hover:text-secondary group-focus-within:text-secondary",
                      isDate ? "cursor-pointer" : "pointer-events-none",
                    )}
                    onClick={handleIconClick}
                  >
                    {renderedIcon || <Icon name="calendar_month" size={20} />}
                  </div>
                )}
            </>
          )}

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex absolute right-4 text-gray-400 hover:text-secondary transition-colors cursor-pointer"
              tabIndex={-1}
            >
              <Icon
                name={showPassword ? "visibility" : "visibility_off"}
                size={20}
              />
            </button>
          )}
        </div>
        {error && <span className="text-danger text-xs ml-2">{error}</span>}
        {helperText && !error && (
          <span className="text-gray-400 text-[11px] font-medium ml-2 leading-tight">
            {helperText}
          </span>
        )}
      </div>
    );
  },
);

NeumorphicInput.displayName = "NeumorphicInput";
