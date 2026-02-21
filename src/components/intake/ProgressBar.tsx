"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Upload PDF" },
  { id: 2, label: "Extracted text" },
  { id: 3, label: "Appeal letter" },
] as const;

export interface ProgressBarProps {
  currentStep: 1 | 2 | 3;
  className?: string;
}

export function ProgressBar({ currentStep, className }: ProgressBarProps) {
  return (
    <nav
      aria-label="Intake progress"
      className={cn("w-full", className)}
    >
      <ol className="flex items-center justify-between gap-2">
        {STEPS.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isUpcoming = currentStep < step.id;

          return (
            <li
              key={step.id}
              className={cn(
                "flex flex-1 items-center transition-all duration-300",
                index < STEPS.length - 1 && "flex-1"
              )}
            >
              <div className="flex flex-col items-center gap-2 w-full">
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-heading text-sm font-semibold transition-all duration-300",
                    isCompleted &&
                      "border-[#5D7052] bg-[#5D7052] text-[#F3F4F1] shadow-[0_4px_20px_-2px_rgba(93,112,82,0.15)]",
                    isCurrent &&
                      "border-[#5D7052] bg-[#5D7052]/10 text-[#5D7052] shadow-[0_4px_20px_-2px_rgba(93,112,82,0.15)]",
                    isUpcoming &&
                      "border-[#DED8CF] bg-[#FDFCF8] text-[#78786C]"
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" strokeWidth={2.5} aria-hidden />
                  ) : (
                    step.id
                  )}
                </span>
                <span
                  className={cn(
                    "text-center text-xs font-medium transition-colors sm:text-sm",
                    isCurrent && "text-[#2C2C24]",
                    isCompleted && "text-[#5D7052]",
                    isUpcoming && "text-[#78786C]"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-1 h-0.5 flex-1 min-w-[12px] rounded-full transition-colors duration-300",
                    isCompleted ? "bg-[#5D7052]/40" : "bg-[#DED8CF]"
                  )}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
