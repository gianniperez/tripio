import { cn } from "@/lib/utils";
import type { IconProps } from "./Icon.types";

export function Icon({
  name,
  fill = false,
  weight = 400,
  grade = 0,
  opticalSize = 24,
  size,
  className,
  rounded = true,
}: IconProps) {
  const variationSettings = [
    `'FILL' ${fill ? 1 : 0}`,
    `'wght' ${weight}`,
    `'GRAD' ${grade}`,
    `'opsz' ${opticalSize}`,
  ].join(", ");

  return (
    <span
      className={cn(
        rounded ? "material-symbols-rounded" : "material-symbols-outlined",
        "select-none inline-block",
        className,
      )}
      style={{
        fontVariationSettings: variationSettings,
        fontSize: size,
        width: size,
        height: "auto",
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
