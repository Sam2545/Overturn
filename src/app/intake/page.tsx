"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IntakeShell } from "@/components/intake/IntakeShell";
import { UploadStep } from "@/components/intake/UploadStep";
import { ExtractedStep } from "@/components/intake/ExtractedStep";
import { LetterStep } from "@/components/intake/LetterStep";
import { createClient } from "@/lib/supabase/client";
import type { ExtractionResult } from "@/types/extraction";

const DEFAULT_APPEAL_LETTER = `Dear Appeals Department,

We are writing to formally appeal the denial of coverage for Jane Doe, Member ID MEM-8821, for the service date January 15, 2025.

We believe this denial was made in error. The determination of "medical necessity" does not align with the patient's documented condition and the requested treatment meets Acme Health's clinical criteria when reviewed in full.

We request a full review of this case and reversal of the denial. Please contact us with any questions.`;

export default function IntakePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [extractedData, setExtractedData] = useState<ExtractionResult | null>(null);
  const [appealLetter, setAppealLetter] = useState<string>(DEFAULT_APPEAL_LETTER);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUploadComplete = (file: File, publicUrl: string) => {
    setUploadedFile(file);
    setPdfUrl(publicUrl);
    setCurrentStep(2);
  };

  const handleExtractedContinue = () => {
    setCurrentStep(3);
  };

  const handleApprove = async () => {
    setError(null);
    setApproving(true);
    const supabase = createClient();

    const { error: insertError } = await supabase.from("claims").insert({
      status: "drafted",
      patient_name: "Jane Doe",
      denial_date: "2025-01-15",
      insurer: "Acme Health",
      extracted_data: {
        memberId: "MEM-8821",
        denialReason: "Medical necessity",
      },
      appeal_letter: appealLetter || null,
      pdf_url: pdfUrl,
    });

    setApproving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.push("/dashboard/claims");
  };

  return (
    <IntakeShell currentStep={currentStep}>
      {currentStep === 1 && (
        <UploadStep onComplete={handleUploadComplete} />
      )}

      {currentStep === 2 && (
        <ExtractedStep
          extractedText={extractedText}
          extractedData={extractedData}
          onContinue={handleExtractedContinue}
        />
      )}

      {currentStep === 3 && (
        <LetterStep
          appealLetter={appealLetter}
          onAppealLetterChange={setAppealLetter}
          onApprove={handleApprove}
          approving={approving}
          error={error}
        />
      )}
    </IntakeShell>
  );
}
