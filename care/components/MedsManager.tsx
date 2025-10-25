"use client";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { db, upsertMed, ensureTodayDoses } from "../lib/db";
import { validateAllowedShape } from "../lib/pii";
import type { Med } from "../lib/models";

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(64),
  doseMg: z.coerce.number().nullable().optional(),
  unit: z.string().min(1).max(16),
  schedule: z.array(z.object({ time: z.string().regex(/^\d{2}:\d{2}$/) })).min(1),
  notes: z.string().max(200).optional(),
});

export default function MedsManager() {
  const [meds, setMeds] = useState<Med[]>([]);
  const { register, control, handleSubmit, reset, setError } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { unit: "mg", schedule: [{ time: "08:00" }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "schedule" });

  const load = async () => setMeds(await db.meds.orderBy("updatedAt").reverse().toArray());
  useEffect(() => { load(); }, []);

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const errs = validateAllowedShape({ name: data.name, notes: data.notes });
    if (errs.length) {
      for (const e of errs) setError(e.field as any, { type: "pii", message: e.message });
      return;
    }
    const id = await upsertMed({ ...data, doseMg: data.doseMg ?? null });
    await ensureTodayDoses();
    reset({ unit: data.unit, schedule: [{ time: "08:00" }] });
    load();
  };

  const del = async (id: string) => {
    await db.meds.delete(id);
    await db.doses.where("medId").equals(id).delete();
    load();
  };

  return (
    <div className="grid gap-3">
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-2 rounded border border-white/10 bg-[var(--card)] p-3 text-[12px]">
        <h2 className="text-[16px] font-semibold">Add / Edit Medication</h2>
        <div className="grid grid-cols-3 gap-2">
          <input className="col-span-2 rounded bg-[var(--surface)] p-1" placeholder="Name" {...register("name")} />
          <input className="rounded bg-[var(--surface)] p-1" placeholder="Unit (e.g., mg)" {...register("unit")} />
          <input className="rounded bg-[var(--surface)] p-1" placeholder="Dose (mg)" inputMode="decimal" {...register("doseMg")} />
          <input className="col-span-2 rounded bg-[var(--surface)] p-1" placeholder="Notes" {...register("notes")} />
        </div>
        <div className="grid gap-2">
          <div className="text-[11px] text-[var(--text-muted)]">Schedule times</div>
          {fields.map((f, idx) => (
            <div key={f.id} className="flex items-center gap-2">
              <input className="w-24 rounded bg-[var(--surface)] p-1" placeholder="HH:MM" {...register(`schedule.${idx}.time` as const)} />
              <button type="button" className="rounded bg-white/10 px-2 py-1" onClick={() => remove(idx)}>Remove</button>
            </div>
          ))}
          <button type="button" className="w-min rounded bg-white/10 px-2 py-1" onClick={() => append({ time: "20:00" })}>+ Add time</button>
        </div>
        <div className="flex justify-end">
          <button className="rounded bg-[var(--accent)] px-3 py-1.5 text-[12px] font-semibold text-black">Save</button>
        </div>
      </form>

      <section className="rounded border border-white/10 bg-[var(--card)] p-3 text-[12px]">
        <h3 className="mb-2 text-[16px] font-semibold">Your Meds</h3>
        <ul className="grid gap-2">
          {meds.length === 0 && <li className="text-[var(--text-muted)]">None yet.</li>}
          {meds.map((m) => (
            <li key={m.id} className="flex items-center justify-between rounded bg-[var(--surface)] p-2">
              <div>
                <div className="font-medium">{m.name} {m.doseMg ?? ""}{m.unit}</div>
                <div className="text-[11px] text-[var(--text-muted)]">{m.schedule.map((s) => s.time).join(", ")}</div>
              </div>
              <button className="rounded bg-white/10 px-2 py-1" onClick={() => del(m.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
