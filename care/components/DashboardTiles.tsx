"use client";
import { useEffect, useState } from "react";
import { db, ensureTodayDoses, plannedDosesAroundNow, getLatestVitals } from "../lib/db";

export default function DashboardTiles() {
  const [summary, setSummary] = useState<{ taken: number; due: number; lastBp?: string; lastHr?: number; lastWeight?: number }>({ taken: 0, due: 0 });

  useEffect(() => {
    (async () => {
      await ensureTodayDoses();
      const ds = await plannedDosesAroundNow(720);
      const taken = ds.filter((d) => d.status === "taken").length;
      const due = ds.filter((d) => d.status !== "taken").length;
      const v = await getLatestVitals();
      setSummary({
        taken,
        due,
        lastBp: v?.bpSystolic && v?.bpDiastolic ? `${v.bpSystolic}/${v.bpDiastolic}` : undefined,
        lastHr: v?.hr,
        lastWeight: v?.weightKg,
      });
    })();
  }, []);

  return (
    <section className="col-span-full rounded-md border border-white/10 bg-[var(--card)] p-3">
      <h2 className="mb-2 text-[16px] font-semibold">Today</h2>
      <div className="grid grid-cols-2 gap-2 text-[12px] text-[var(--text-muted)]">
        <div className="rounded bg-[var(--surface)] p-2">
          <div className="text-[11px]">Meds</div>
          <div className="text-[13px] text-[var(--text)]">{summary.taken} taken · {summary.due} due</div>
        </div>
        <div className="rounded bg-[var(--surface)] p-2">
          <div className="text-[11px]">BP / HR</div>
          <div className="text-[13px] text-[var(--text)]">{summary.lastBp ?? "—"} · {summary.lastHr ?? "—"}</div>
        </div>
        <div className="col-span-2 rounded bg-[var(--surface)] p-2">
          <div className="text-[11px]">Weight</div>
          <div className="text-[13px] text-[var(--text)]">{summary.lastWeight ? `${summary.lastWeight} kg` : "—"}</div>
        </div>
      </div>
      <a className="mt-3 inline-block rounded bg-[var(--accent)] px-3 py-2 text-[12px] font-semibold text-black hover:opacity-90" href="/check-in">Log now</a>
    </section>
  );
}
