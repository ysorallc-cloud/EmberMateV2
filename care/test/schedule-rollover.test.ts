import 'fake-indexeddb/auto';
import { describe, expect, it } from "vitest";
import { ensureTodayDoses, timeToTodayISO, db, upsertMed } from "../lib/db";

// lightweight test: creating a med with schedule populates today's planned doses (idempotent)
describe("schedule rollover", () => {
  it("ensures today's doses exist for meds schedule", async () => {
    await db.transaction('rw', db.meds, db.doses, async () => {
      await db.meds.clear();
      await db.doses.clear();
    });
    await upsertMed({ name: "TestMed", doseMg: 5, unit: "mg", schedule: [{ time: "08:00" }], notes: "" });
    await ensureTodayDoses();
    const first = await db.doses.toArray();
    await ensureTodayDoses();
    const second = await db.doses.toArray();
    expect(first.length).toBe(1);
    expect(second.length).toBe(1);
    expect(first[0].plannedAt.startsWith(timeToTodayISO("08:00").slice(0, 10))).toBe(true);
  });
});
