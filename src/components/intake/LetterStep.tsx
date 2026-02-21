"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Phrases that can be toggled in/out of the letter. All start selected when letter contains them. */
const MOCK_PHRASES = [
  "Medical necessity",
  "Jane Doe",
  "MEM-8821",
  "January 15, 2025",
  "Acme Health",
  "clinical criteria",
];

const DEFAULT_LETTER = `Dear Appeals Department,

We are writing to formally appeal the denial of coverage for Jane Doe, Member ID MEM-8821, for the service date January 15, 2025.

We believe this denial was made in error. The determination of "medical necessity" does not align with the patient's documented condition and the requested treatment meets Acme Health's clinical criteria when reviewed in full.

We request a full review of this case and reversal of the denial. Please contact us with any questions.`;

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export interface LetterStepProps {
  appealLetter: string;
  onAppealLetterChange: (value: string) => void;
  onApprove: () => void;
  approving?: boolean;
  error?: string | null;
}

export function LetterStep({
  appealLetter,
  onAppealLetterChange,
  onApprove,
  approving = false,
  error = null,
}: LetterStepProps) {
  /** Toggle phrase: if it's in the letter, remove it; otherwise append it. Click = remove term you don't want. */
  const handleTogglePhrase = (phrase: string) => {
    const isInLetter = appealLetter.includes(phrase);
    if (isInLetter) {
      const regex = new RegExp(escapeRegex(phrase), "g");
      const next = appealLetter.replace(regex, " ").replace(/\s+/g, " ").trim();
      onAppealLetterChange(next);
    } else {
      const separator = appealLetter.length > 0 && !appealLetter.endsWith(" ") ? " " : "";
      onAppealLetterChange(appealLetter + separator + phrase);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Title only — no description */}
      <div className="flex flex-col items-center text-center">
        <h2 className="font-heading text-4xl font-semibold text-[#2C2C24] md:text-5xl">
          Appeal letter
        </h2>
      </div>

      {/* Toggleable phrase tags: selected = in letter (green), click to remove from letter */}
      <div className="flex flex-wrap justify-center gap-2">
        {MOCK_PHRASES.map((phrase) => {
          const selected = appealLetter.includes(phrase);
          return (
            <button
              key={phrase}
              type="button"
              onClick={() => handleTogglePhrase(phrase)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-medium shadow-[0_2px_8px_-2px_rgba(93,112,82,0.08)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5D7052]/30 focus-visible:ring-offset-2",
                selected
                  ? "border-[#5D7052]/50 bg-[#5D7052]/15 text-[#5D7052] hover:border-[#5D7052] hover:bg-[#5D7052]/25"
                  : "border-[#DED8CF] bg-[#E6DCCD]/40 text-[#4A4A40] hover:border-[#5D7052]/30 hover:bg-[#5D7052]/10 hover:text-[#5D7052]"
              )}
              aria-label={selected ? `Remove "${phrase}" from letter` : `Add "${phrase}" to letter`}
              aria-pressed={selected}
            >
              {phrase}
            </button>
          );
        })}
      </div>

      {/* Appeal letter card */}
      <div className="flex flex-col overflow-hidden rounded-3xl border border-[#DED8CF]/50 bg-[#FEFEFA] shadow-[0_4px_20px_-2px_rgba(93,112,82,0.15)]">
        <div className="border-b border-[#DED8CF]/50 px-6 py-4">
          <h3 className="font-heading text-lg font-semibold text-[#2C2C24]">
            Appeal letter
          </h3>
        </div>
        <div className="p-6">
          <textarea
            className="min-h-[280px] w-full resize-y rounded-3xl border border-[#DED8CF] bg-white/50 px-4 py-4 font-sans text-sm leading-relaxed text-[#2C2C24] placeholder:text-[#78786C] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5D7052]/30 focus-visible:ring-offset-2"
            value={appealLetter}
            onChange={(e) => onAppealLetterChange(e.target.value)}
            placeholder={DEFAULT_LETTER}
            aria-label="Appeal letter content"
          />
          {error && (
            <p className="mt-2 text-sm text-[#A85448]" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>

      {/* Big submit button at bottom — outside appeal letter component */}
      <div className="flex flex-col items-center gap-3">
        <Button
          onClick={onApprove}
          disabled={approving}
          className="w-full max-w-md rounded-full px-8 py-6 text-lg md:max-w-lg"
        >
          {approving ? "Adding to board…" : "Approve and add to board"}
        </Button>
      </div>
    </div>
  );
}
