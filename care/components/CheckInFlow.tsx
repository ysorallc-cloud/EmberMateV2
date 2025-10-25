"use client";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { db, ensureTodayDoses, getLatestVitals, plannedDosesAroundNow, upsertDose, upsertVitals } from "../lib/db";
import { validateAllowedShape } from "../lib/pii";

const vitalsSchema = z.object({
  bpSystolic: z.coerce.number().int().min(70).max(200).optional(),
  bpDiastolic: z.coerce.number().int().min(40).max(130).optional(),
  hr: z.coerce.number().int().min(30).max(220).optional(),
  weightKg: z.coerce.number().min(20).max(400).optional(),
  tempC: z.coerce.number().min(30).max(43).optional(),
  spo2: z.coerce.number().int().min(70).max(100).optional(),
  note: z.string().max(300).optional(),
});

type VitalsForm = z.infer<typeof vitalsSchema>;

type DoseItem = { id: string; medId: string; label: string; plannedAt: string; selected: boolean };

export default function CheckInFlow() {
  const [step, setStep] = useState(1);
  const [doses, setDoses] = useState<DoseItem[]>([]);
  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm<VitalsForm>({ resolver: zodResolver(vitalsSchema) });
  const [transcript, setTranscript] = useState("");
  const [canVoice, setCanVoice] = useState(false);
  const [recognizer, setRecognizer] = useState<SpeechRecognition | null>(null);
  const [piiError, setPiiError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize planned doses and last vitals
    ensureTodayDoses().then(async () => {
      const ds = await plannedDosesAroundNow();
      const meds = await db.meds.toArray();
      const items: DoseItem[] = ds.map((d) => {
        const med = meds.find((m) => m.id === d.medId);
        return { id: d.id, medId: d.medId, plannedAt: d.plannedAt, label: med ? `${med.name} ${med.doseMg ?? ""}${med.unit}` : d.medId, selected: d.status === "taken" };
      });
      setDoses(items);
    });
    getLatestVitals().then((v) => {
      if (!v) return;
      if (v.bpSystolic) setValue("bpSystolic", v.bpSystolic);
      if (v.bpDiastolic) setValue("bpDiastolic", v.bpDiastolic);
      if (v.hr) setValue("hr", v.hr);
      if (v.weightKg) setValue("weightKg", v.weightKg);
      if (v.tempC) setValue("tempC", v.tempC);
      if (v.spo2) setValue("spo2", v.spo2);
    });

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR || (window as any).__TEST_SPEECH__) setCanVoice(true);
  }, [setValue]);

  const anySelected = useMemo(() => doses.some((d) => d.selected), [doses]);

  const toggleDose = (id: string) => {
    setDoses((prev) => prev.map((d) => (d.id === id ? { ...d, selected: !d.selected } : d)));
  };

  const markAllTaken = () => setDoses((prev) => prev.map((d) => ({ ...d, selected: true })));

  const onSubmit = async (data: VitalsForm) => {
    setPiiError(null);
    const errs = validateAllowedShape({ note: transcript || data.note });
    if (errs.length) {
      setPiiError(errs.map((e) => e.message).join("\n"));
      return;
    }
    const at = new Date().toISOString();
    await upsertVitals({ id: crypto.randomUUID(), at, ...data, note: transcript || data.note });
    for (const d of doses) {
      if (d.selected) await upsertDose({ id: d.id, medId: d.medId, plannedAt: d.plannedAt, takenAt: at, status: "taken" });
    }
    alert("Saved");
  };

  const startVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      if ((window as any).__TEST_SPEECH__) {
        setTranscript("Test note");
      }
      return;
    }
    const r: SpeechRecognition = new SR();
    r.lang = "en-US";
    r.interimResults = true;
    r.onresult = (e: SpeechRecognitionEvent) => {
      let s = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        s += e.results[i][0].transcript;
      }
      setTranscript(s);
    };
    r.onend = () => setRecognizer(null);
    setRecognizer(r);
    r.start();
  };

  const stopVoice = () => {
    recognizer?.stop();
    setRecognizer(null);
  };

  return (
    <div className="grid gap-3">
      {step === 1 && (
        <section className="rounded-md border border-white/10 bg-[var(--card)] p-3">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[16px] font-semibold">Step 1 · Meds</h2>
            <button className="rounded bg-white/10 px-2 py-1 text-[12px] hover:bg-white/20" onClick={markAllTaken}>
              All taken
            </button>
          </div>
          <ul className="grid gap-2 text-[13px]">
            {doses.length === 0 && <li className="text-[12px] text-[var(--text-muted)]">No doses planned right now.</li>}
            {doses.map((d) => (
              <li key={d.id} className="flex items-center justify-between rounded bg-[var(--surface)] px-2 py-1.5">
                <span>{d.label}</span>
                <button
                  className={`rounded px-2 py-1 text-[12px] ${d.selected ? "bg-[var(--accent)] text-black" : "bg-white/10"}`}
                  onClick={() => toggleDose(d.id)}
                >
                  {d.selected ? "Taken" : "Skip"}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-end">
            <button className="rounded bg-[var(--accent)] px-3 py-1.5 text-[12px] font-semibold text-black" onClick={() => setStep(2)} disabled={!anySelected && doses.length > 0}>
              Next
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="rounded-md border border-white/10 bg-[var(--card)] p-3">
          <h2 className="mb-2 text-[16px] font-semibold">Step 2 · Vitals</h2>
          <form className="grid grid-cols-2 gap-2 text-[12px]" onSubmit={handleSubmit(() => setStep(3))}>
            <Field label="BP Systolic" unit="mmHg" error={errors.bpSystolic?.message}>
              <input className="w-full rounded bg-[var(--surface)] p-1" {...register("bpSystolic")} inputMode="numeric" />
            </Field>
            <Field label="BP Diastolic" unit="mmHg" error={errors.bpDiastolic?.message}>
              <input className="w-full rounded bg-[var(--surface)] p-1" {...register("bpDiastolic")} inputMode="numeric" />
            </Field>
            <Field label="HR" unit="bpm" error={errors.hr?.message}>
              <input className="w-full rounded bg-[var(--surface)] p-1" {...register("hr")} inputMode="numeric" />
            </Field>
            <Field label="Weight" unit="kg" error={errors.weightKg?.message}>
              <input className="w-full rounded bg-[var(--surface)] p-1" {...register("weightKg")} inputMode="decimal" />
            </Field>
            <Field label="Temp" unit="°C" error={errors.tempC?.message}>
              <input className="w-full rounded bg-[var(--surface)] p-1" {...register("tempC")} inputMode="decimal" />
            </Field>
            <Field label="SpO₂" unit="%" error={errors.spo2?.message}>
              <input className="w-full rounded bg-[var(--surface)] p-1" {...register("spo2")} inputMode="numeric" />
            </Field>
            <div className="col-span-2 flex justify-end gap-2">
              <button type="button" className="rounded bg-white/10 px-2 py-1" onClick={() => {
                const v = getValues();
                ["bpSystolic","bpDiastolic","hr","weightKg","tempC","spo2"].forEach((k) => setValue(k as any, (v as any)[k]));
              }}>Use previous</button>
              <button className="rounded bg-[var(--accent)] px-3 py-1.5 text-[12px] font-semibold text-black">Next</button>
            </div>
          </form>
        </section>
      )}

      {step === 3 && (
        <section className="rounded-md border border-white/10 bg-[var(--card)] p-3">
          <h2 className="mb-2 text-[16px] font-semibold">Step 3 · Note</h2>
          <div className="grid gap-2 text-[12px]">
            <textarea className="min-h-24 w-full rounded bg-[var(--surface)] p-2" placeholder="Optional note" value={transcript} onChange={(e) => setTranscript(e.target.value)} />
            {piiError && <div className="rounded border border-red-500/40 bg-red-500/10 p-2 text-[11px] text-red-300 whitespace-pre-line">{piiError}</div>}
            {canVoice && (
              <div className="flex gap-2">
                {recognizer ? (
                  <button className="rounded bg-red-500/80 px-2 py-1 text-black" onClick={stopVoice}>Stop</button>
                ) : (
                  <button className="rounded bg-[var(--accent)] px-2 py-1 text-black" onClick={startVoice}>Mic</button>
                )}
                <span className="text-[var(--text-muted)]">Speak and edit before save.</span>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button className="rounded bg-white/10 px-2 py-1" onClick={() => setStep(2)}>Back</button>
              <button className="rounded bg-[var(--accent)] px-3 py-1.5 text-[12px] font-semibold text-black" onClick={handleSubmit(onSubmit)}>Save</button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function Field({ label, unit, error, children }: { label: string; unit?: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1">
      <span className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
        <span>{label}</span>
        {unit && <span>{unit}</span>}
      </span>
      {children}
      {error && <span className="text-[10px] text-red-400">{error}</span>}
    </label>
  );
}
