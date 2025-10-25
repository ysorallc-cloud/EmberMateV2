export type PiiError = {
  field: string;
  message: string;
  value?: string;
};

const emailRe = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const phoneRe = /(?:(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/;
const ssnRe = /\b\d{3}-?\d{2}-?\d{4}\b/;
const dobRe = /(\b\d{2}[\/\-]\d{2}[\/\-]\d{4}\b|\b\d{4}-\d{2}-\d{2}\b)/;
const addressRe = /(\d+\s+(?:[A-Za-z0-9'\.\-]+\s)+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)\b)/i;

export function scanValueForPII(field: string, value: unknown): PiiError[] {
  const text = typeof value === "string" ? value : JSON.stringify(value ?? "");
  const errs: PiiError[] = [];
  if (!text) return errs;

  if (emailRe.test(text)) errs.push({ field, message: "Email addresses are not allowed.", value: text });
  if (phoneRe.test(text)) errs.push({ field, message: "Phone numbers are not allowed.", value: text });
  if (ssnRe.test(text)) errs.push({ field, message: "SSNs are not allowed.", value: text });
  if (dobRe.test(text)) errs.push({ field, message: "Full DOB is not allowed.", value: text });
  if (addressRe.test(text)) errs.push({ field, message: "Street addresses are not allowed.", value: text });
  return errs;
}

export function validateAllowedShape(record: Record<string, unknown>): PiiError[] {
  const disallowedKeys = [
    "lastName",
    "fullName",
    "address",
    "email",
    "phone",
    "ssn",
    "dob",
    "clinician",
    "doctor",
  ];
  const errs: PiiError[] = [];
  for (const key of Object.keys(record)) {
    if (disallowedKeys.includes(key)) {
      errs.push({ field: key, message: `Field \`${key}\` is not allowed.` });
    } else {
      errs.push(...scanValueForPII(key, (record as any)[key]));
    }
  }
  return errs;
}
