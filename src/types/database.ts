/**
 * Supabase database types for Overturn.
 * Matches the schema in supabase-schema.md.
 */

export type ClaimStatus = "drafted" | "agent_calling" | "in_review" | "overturned";

export type TranscriptRole = "agent" | "rep" | "system";

/** Row from public.claims */
export interface ClaimRow {
  id: string;
  created_at: string;
  updated_at: string;
  status: ClaimStatus;
  patient_name: string | null;
  denial_date: string | null;
  insurer: string | null;
  extracted_data: Record<string, unknown> | null;
  appeal_letter: string | null;
  pdf_url: string | null;
}

/** Row from public.call_transcripts */
export interface CallTranscriptRow {
  id: string;
  claim_id: string | null;
  created_at: string;
  role: TranscriptRole;
  content: string;
}

/** UI-friendly claim (camelCase) */
export interface Claim {
  id: string;
  patientName: string;
  insurer: string;
  denialDate: string;
  status: ClaimStatus;
}

export function claimRowToClaim(row: ClaimRow): Claim {
  return {
    id: row.id,
    patientName: row.patient_name ?? "—",
    insurer: row.insurer ?? "—",
    denialDate: row.denial_date ?? "",
    status: row.status,
  };
}
