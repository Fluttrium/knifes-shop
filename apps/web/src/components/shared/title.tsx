import clsx from "clsx";
import React from "react";

type TitleSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface Props {
  size?: TitleSize;
  className?: string;
  text: string;
}

export const Title: React.FC<Props> = ({ text, size = "sm", className }) => {
  // Map HTML tags based on the title size
  const mapTagBySize = {
    xs: "h5",
    sm: "h4",
    md: "h3",
    lg: "h2",
    xl: "h1",
    "2xl": "h1",
  } as const;

  // Map Tailwind CSS classes for different sizes
  const mapClassNameBySize = {
    xs: "text-[16px] sm:text-[18px]",
    sm: "text-[22px] sm:text-[24px]",
    md: "text-[26px] sm:text-[28px]",
    lg: "text-[32px] sm:text-[36px]",
    xl: "text-[40px] sm:text-[44px]",
    "2xl": "text-[48px] sm:text-[52px]",
  } as const;

  // Create the title element with dynamic class names
  return React.createElement(
    mapTagBySize[size],
    { className: clsx(mapClassNameBySize[size], className) },
    text,
  );
};
