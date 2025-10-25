import { describe, expect, it } from "vitest";
import { scanValueForPII, validateAllowedShape } from "../lib/pii";

describe("PII guard", () => {
  it("blocks emails, phones, SSNs, DOBs, and addresses", () => {
    const samples = [
      "user@example.com",
      "(555) 123-4567",
      "123-45-6789",
      "1990-05-03",
      "123 Main St",
    ];
    for (const s of samples) {
      const errs = scanValueForPII("field", s);
      expect(errs.length).toBeGreaterThan(0);
    }
  });

  it("blocks disallowed keys like clinician", () => {
    const errs = validateAllowedShape({ clinician: "Dr. Jane" });
    expect(errs.some((e) => e.field === "clinician")).toBe(true);
  });

  it("passes allowed content", () => {
    const errs = validateAllowedShape({ note: "Felt fine today", nickname: "Sam" });
    expect(errs.length).toBe(0);
  });
});
