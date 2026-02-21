/**
 * Shape of the extraction API response (structuredContent.parsed_fields and related).
 * Used to display extracted fields in the intake Extracted step.
 */

export interface ExtractionIdentifier {
  label: string;
  value: string;
}

export interface ParsedFields {
  claim_id: string;
  patient_name: string;
  patient_address: string;
  identifiers: ExtractionIdentifier[];
  denial_codes: string[];
  cpt_codes: string[];
  policy_references: string[];
  denial_reason_text: string;
  extraction_notes: {
    claim_id_found?: boolean;
    patient_name_found?: boolean;
    patient_address_found?: boolean;
    identifiers_found?: boolean;
    denial_codes_found?: boolean;
    cpt_codes_found?: boolean;
    denial_reason_found?: boolean;
  };
}

export interface ExtractionResult {
  parsed_fields: ParsedFields;
  parsing_source?: string;
  parsing_warnings?: string[];
  denial_code_analysis?: unknown[];
}
