"use client";
import { useEffect, useState } from "react";
import { db } from "../lib/db";
import { LineChart, Line, ResponsiveContainer } from "recharts";

type Pt = { at: string; weightKg?: number; hr?: number };

export default function VitalsTrends() {
  const [data, setData] = useState<Pt[]>([]);

  useEffect(() => {
    (async () => {
      const vs = await db.vitals.orderBy("at").reverse().limit(30).toArray();
      setData(vs.reverse().map((v) => ({ at: v.at, weightKg: v.weightKg, hr: v.hr })));
    })();
  }, []);

  return (
    <section className="col-span-full rounded-md border border-white/10 bg-[var(--card)] p-3">
      <h2 className="mb-2 text-[16px] font-semibold">Last 30 days</h2>
      <div className="grid grid-cols-2 gap-3 text-[12px]">
        <div className="rounded bg-[var(--surface)] p-2">
          <div className="text-[11px] text-[var(--text-muted)]">Weight</div>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
                <Line type="monotone" dataKey="weightKg" stroke="#6EE7B7" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded bg-[var(--surface)] p-2">
          <div className="text-[11px] text-[var(--text-muted)]">HR</div>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
                <Line type="monotone" dataKey="hr" stroke="#93C5FD" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
