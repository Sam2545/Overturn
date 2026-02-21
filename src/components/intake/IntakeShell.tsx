"use client";

import { DashboardNav } from "@/components/dashboard-nav";
import { ProgressBar } from "./ProgressBar";
import { cn } from "@/lib/utils";

export interface IntakeShellProps {
  currentStep: 1 | 2 | 3;
  children: React.ReactNode;
  className?: string;
}

export function IntakeShell({ currentStep, children, className }: IntakeShellProps) {
  return (
    <div className={cn("min-h-screen bg-[#FDFCF8]", className)}>
      <DashboardNav />

      {/* Progress bar centered below header */}
      <div className="mx-auto max-w-2xl px-4 pt-6 pb-2">
        <ProgressBar currentStep={currentStep} />
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
