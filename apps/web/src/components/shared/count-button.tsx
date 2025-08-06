import React from "react";
import { CountIconButton } from "./count-icon-button";
import { cn } from "@/lib/utils";

export interface CountButtonProps {
  value?: number;
  size?: "sm" | "lg";
  onClick?: (type: "plus" | "minus") => void;
  className?: string;
  disabled?: boolean;
}

export const CountButton: React.FC<CountButtonProps> = ({
  className,
  onClick,
  value = 1,
  size = "sm",
  disabled = false,
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-between gap-3",
        className,
      )}
    >
      <CountIconButton
        onClick={() => onClick?.("minus")}
        disabled={value === 1 || disabled}
        size={size}
        type="minus"
      />

      <b className={size === "sm" ? "text-sm" : "text-md"}>{value}</b>

      <CountIconButton
        onClick={() => onClick?.("plus")}
        disabled={disabled}
        size={size}
        type="plus"
      />
    </div>
  );
};
