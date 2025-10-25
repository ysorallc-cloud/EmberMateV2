"use client";
import { db, generateId, upsertMed, upsertVitals } from "../lib/db";

export default function SeedDemo() {
  const run = async () => {
    const meds = [
      { name: "Lisinopril", doseMg: 10, unit: "mg", schedule: [{ time: "08:00" }], notes: "" },
      { name: "Atorvastatin", doseMg: 20, unit: "mg", schedule: [{ time: "20:00" }], notes: "" },
    ];
    for (const m of meds) await upsertMed(m as any);
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const at = new Date(d.setHours(8, 0, 0, 0)).toISOString();
      await upsertVitals({ id: generateId(), at, hr: 60 + Math.floor(Math.random() * 10), weightKg: 72 + Math.random(), bpSystolic: 115 + Math.floor(Math.random() * 5), bpDiastolic: 75 + Math.floor(Math.random() * 5) });
    }
    alert("Seeded");
  };

  return (
    <button className="rounded bg-white/10 px-2 py-1 text-[12px]" onClick={run}>Seed demo data</button>
  );
}
