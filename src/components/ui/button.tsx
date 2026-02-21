"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "secondary";
  size?: "sm" | "default" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5D7052]/30 focus-visible:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
          {
            "h-10 px-6 text-sm": size === "sm",
            "h-12 px-8 text-base": size === "default",
            "h-14 px-10 text-lg": size === "lg",
          },
          {
            "bg-[#5D7052] text-[#F3F4F1] shadow-[0_4px_20px_-2px_rgba(93,112,82,0.15)] hover:scale-105 hover:shadow-[0_6px_24px_-4px_rgba(93,112,82,0.25)]":
              variant === "primary",
            "border-2 border-[#C18C5D] bg-transparent text-[#C18C5D] hover:bg-[#C18C5D]/10":
              variant === "outline",
            "bg-transparent text-[#5D7052] hover:bg-[#5D7052]/10":
              variant === "ghost",
            "bg-[#C18C5D] text-white shadow-[0_4px_20px_-2px_rgba(193,140,93,0.2)] hover:scale-105 hover:shadow-[0_6px_24px_-4px_rgba(193,140,93,0.3)]":
              variant === "secondary",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
