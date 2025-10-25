"use client";
import { useEffect, useState } from "react";
import { db, getAppSettings } from "../lib/db";

export default function SettingsPanel() {
  const [useVoice, setUseVoice] = useState(true);

  useEffect(() => {
    getAppSettings().then((s) => setUseVoice(!!s.useVoice));
  }, []);

  const exportData = async () => {
    const data = {
      meds: await db.meds.toArray(),
      doses: await db.doses.toArray(),
      vitals: await db.vitals.toArray(),
      settings: await db.settings.toArray(),
    };
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `care-export-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = async (file: File) => {
    const text = await file.text();
    const json = JSON.parse(text);
    await db.transaction("rw", db.meds, db.doses, db.vitals, db.settings, async () => {
      if (json.meds) await db.meds.bulkPut(json.meds);
      if (json.doses) await db.doses.bulkPut(json.doses);
      if (json.vitals) await db.vitals.bulkPut(json.vitals);
      if (json.settings) await db.settings.bulkPut(json.settings);
    });
    alert("Import complete");
  };

  const wipe = async () => {
    await db.delete();
    window.location.reload();
  };

  return (
    <div className="grid gap-3 text-[12px]">
      <section className="rounded border border-white/10 bg-[var(--card)] p-3">
        <h2 className="mb-2 text-[16px] font-semibold">Data</h2>
        <div className="flex gap-2">
          <button className="rounded bg-[var(--accent)] px-3 py-1.5 text-black" onClick={exportData}>Export JSON</button>
          <label className="rounded bg-white/10 px-3 py-1.5">
            Import JSON
            <input type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files && importData(e.target.files[0])} />
          </label>
          <button className="rounded bg-red-500/80 px-3 py-1.5 text-black" onClick={wipe}>Wipe local data</button>
        </div>
      </section>

      <section className="rounded border border-white/10 bg-[var(--card)] p-3">
        <h2 className="mb-2 text-[16px] font-semibold">Preferences</h2>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={useVoice} onChange={(e) => setUseVoice(e.target.checked)} />
          <span>Enable voice input (if supported)</span>
        </label>
      </section>

      <section className="rounded border border-white/10 bg-[var(--card)] p-3">
        <h2 className="mb-2 text-[16px] font-semibold">Legal</h2>
        <a className="underline" href="/legal/disclaimer">View disclaimer</a>
      </section>
    </div>
  );
}
