"use client";

import { Button } from "@/components/ui/button";
import type { ExtractionResult, ParsedFields } from "@/types/extraction";

const MOCK_EXTRACTED_TEXT = `Denial Notice – Acme Health

Member: Jane Doe (MEM-8821)
Date of denial: January 15, 2025

We are writing to inform you that your request for coverage has been denied.

Reason for denial: Medical necessity. The requested service does not meet our clinical criteria for coverage under your plan.

You have the right to appeal this decision within 180 days. Please submit your appeal in writing along with any supporting documentation to the address below.

If you have questions, contact our Member Services department.`;

/** Mock extraction matching the real API shape for demo */
const MOCK_EXTRACTION: ExtractionResult = {
  parsed_fields: {
    claim_id: "987654321",
    patient_name: "Jane Doe Member Id",
    patient_address: "UNKNOWN",
    identifiers: [
      { label: "member_id", value: "XYZ123456789" },
      { label: "policy", value: "Bulletin" },
    ],
    denial_codes: [],
    cpt_codes: ["97110"],
    policy_references: [],
    denial_reason_text: "Reason not clearly found in document.",
    extraction_notes: {
      claim_id_found: true,
      patient_name_found: true,
      patient_address_found: false,
      identifiers_found: true,
      denial_codes_found: false,
      cpt_codes_found: true,
      denial_reason_found: false,
    },
  },
  parsing_source: "regex",
  parsing_warnings: [
    "LLM parsing unavailable. Fell back to regex parser.",
  ],
};

function FieldRow({
  label,
  value,
  subdued = false,
}: {
  label: string;
  value: string;
  subdued?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-[#DED8CF]/50 bg-white/50 px-4 py-3 transition-colors hover:border-[#5D7052]/20">
      <span className="text-xs font-medium uppercase tracking-wider text-[#78786C]">
        {label.replace(/_/g, " ")}
      </span>
      <span className={subdued ? "text-[#78786C] italic" : "text-[#2C2C24]"}>
        {value || "—"}
      </span>
    </div>
  );
}

function ExtractedFieldsPanel({ fields }: { fields: ParsedFields }) {
  const notes = fields.extraction_notes ?? {};
  const noteEntries = [
    { key: "claim_id_found", label: "Claim ID" },
    { key: "patient_name_found", label: "Patient name" },
    { key: "patient_address_found", label: "Patient address" },
    { key: "identifiers_found", label: "Identifiers" },
    { key: "denial_codes_found", label: "Denial codes" },
    { key: "cpt_codes_found", label: "CPT codes" },
    { key: "denial_reason_found", label: "Denial reason" },
  ] as const;

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
      {/* Claim & patient */}
      <section className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#78786C]">
          Claim & patient
        </h4>
        <div className="space-y-2">
          <FieldRow label="claim_id" value={fields.claim_id} />
          <FieldRow label="patient_name" value={fields.patient_name} />
          <FieldRow
            label="patient_address"
            value={fields.patient_address}
            subdued={fields.patient_address === "UNKNOWN"}
          />
        </div>
      </section>

      {/* Identifiers */}
      {fields.identifiers?.length > 0 && (
        <section className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#78786C]">
            Identifiers
          </h4>
          <div className="space-y-2">
            {fields.identifiers.map((id) => (
              <FieldRow
                key={id.label}
                label={id.label}
                value={id.value}
              />
            ))}
          </div>
        </section>
      )}

      {/* Codes */}
      <section className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#78786C]">
          Codes
        </h4>
        <div className="flex flex-wrap gap-2">
          {fields.cpt_codes?.length > 0 ? (
            fields.cpt_codes.map((code) => (
              <span
                key={code}
                className="rounded-full border border-[#5D7052]/30 bg-[#5D7052]/10 px-3 py-1 text-sm font-medium text-[#5D7052]"
              >
                CPT {code}
              </span>
            ))
          ) : (
            <span className="text-sm text-[#78786C]">—</span>
          )}
          {fields.denial_codes?.length > 0 &&
            fields.denial_codes.map((code) => (
              <span
                key={code}
                className="rounded-full border border-[#C18C5D]/30 bg-[#C18C5D]/10 px-3 py-1 text-sm font-medium text-[#C18C5D]"
              >
                {code}
              </span>
            ))}
        </div>
      </section>

      {/* Policy references */}
      {fields.policy_references?.length > 0 && (
        <section className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#78786C]">
            Policy references
          </h4>
          <ul className="list-inside list-disc space-y-1 text-sm text-[#2C2C24]">
            {fields.policy_references.map((ref, i) => (
              <li key={i}>{ref}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Denial reason */}
      <section className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#78786C]">
          Denial reason
        </h4>
        <div className="rounded-2xl border border-[#DED8CF]/50 bg-white/50 px-4 py-3">
          <p className="text-sm leading-relaxed text-[#2C2C24]">
            {fields.denial_reason_text || "—"}
          </p>
        </div>
      </section>

      {/* Extraction notes (what was found) */}
      <section className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#78786C]">
          Extraction notes
        </h4>
        <div className="flex flex-wrap gap-2">
          {noteEntries.map(({ key, label }) => {
            const found = notes[key as keyof typeof notes];
            return (
              <span
                key={key}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  found
                    ? "bg-[#5D7052]/10 text-[#5D7052]"
                    : "bg-[#F0EBE5] text-[#78786C]"
                }`}
                title={found ? "Found" : "Not found"}
              >
                {label}: {found ? "✓" : "—"}
              </span>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export interface ExtractedStepProps {
  extractedText: string;
  /** When provided (e.g. from extraction API), displayed in the right panel. Falls back to mock. */
  extractedData?: ExtractionResult | null;
  onContinue: () => void;
}

export function ExtractedStep({
  extractedText,
  extractedData,
  onContinue,
}: ExtractedStepProps) {
  const displayText = extractedText || MOCK_EXTRACTED_TEXT;
  const data = extractedData ?? MOCK_EXTRACTION;
  const fields = data.parsed_fields;

  return (
    <div className="flex flex-col gap-10">
      {/* Title and description — same style as Upload PDF */}
      <div className="flex flex-col items-center text-center">
        <h2 className="font-heading text-4xl font-semibold text-[#2C2C24] md:text-5xl">
          Extracted text
        </h2>
        <p className="mt-4 max-w-xl text-[#78786C]">
          Review the denial text we extracted from your PDF and the structured fields below.
        </p>
      </div>

      {/* Parallel panels: extracted text (left) and parsed fields (right) */}
      <div className="grid min-h-[320px] gap-8 lg:grid-cols-2 lg:items-stretch">
        {/* Left: scrollable extracted denial text */}
        <div className="flex flex-col overflow-hidden rounded-3xl border border-[#DED8CF]/50 bg-[#FEFEFA] shadow-[0_4px_20px_-2px_rgba(93,112,82,0.15)]">
          <div className="border-b border-[#DED8CF]/50 px-6 py-4">
            <h3 className="font-heading text-lg font-semibold text-[#2C2C24]">
              From your PDF
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[#2C2C24]">
              {displayText}
            </pre>
          </div>
        </div>

        {/* Right: parsed fields from extraction API */}
        <div className="flex flex-col overflow-hidden rounded-3xl border border-[#DED8CF]/50 bg-[#FEFEFA] shadow-[0_4px_20px_-2px_rgba(93,112,82,0.15)]">
          <div className="flex items-center justify-between border-b border-[#DED8CF]/50 px-6 py-4">
            <h3 className="font-heading text-lg font-semibold text-[#2C2C24]">
              Parsed fields
            </h3>
            {data.parsing_source && (
              <span className="rounded-full bg-[#F0EBE5] px-2.5 py-0.5 text-xs font-medium text-[#78786C]">
                {data.parsing_source}
              </span>
            )}
          </div>
          <ExtractedFieldsPanel fields={fields} />
        </div>
      </div>

      {/* Parsing warnings — subtle, below panels */}
      {data.parsing_warnings && data.parsing_warnings.length > 0 && (
        <div className="rounded-2xl border border-[#E6DCCD] bg-[#E6DCCD]/20 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wider text-[#78786C]">
            Parsing notes
          </p>
          <ul className="mt-1 list-inside list-disc space-y-0.5 text-sm text-[#4A4A40]">
            {data.parsing_warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Big submit button at bottom */}
      <div className="flex flex-col items-center gap-3">
        <Button
          onClick={onContinue}
          className="w-full max-w-md rounded-full px-8 py-6 text-lg md:max-w-lg"
        >
          Continue to appeal letter
        </Button>
      </div>
    </div>
  );
}
