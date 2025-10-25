import Dexie, { Table } from "dexie";
import type { Dose, Med, Settings, Vitals } from "./models";

export class CareDB extends Dexie {
  meds!: Table<Med, string>;
  doses!: Table<Dose, string>;
  vitals!: Table<Vitals, string>;
  settings!: Table<Settings, string>;

  constructor() {
    super("care-db");
    this.version(1).stores({
      meds: "id, name, updatedAt",
      doses: "id, medId, plannedAt, status",
      vitals: "id, at",
      settings: "id",
    });
  }
}

export const db = new CareDB();

export function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return (crypto as any).randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export async function getAppSettings(): Promise<Settings> {
  const existing = await db.settings.get("app");
  if (existing) return existing;
  const defaults: Settings = {
    id: "app",
    disclaimerAccepted: false,
    useVoice: true,
    weightDeltaAlertPct: 3,
  };
  await db.settings.put(defaults);
  return defaults;
}

export async function setDisclaimerAccepted(): Promise<void> {
  const s = await getAppSettings();
  await db.settings.put({ ...s, disclaimerAccepted: true });
}

export async function upsertVitals(v: Omit<Vitals, "id"> & { id?: string }): Promise<string> {
  const id = v.id ?? generateId();
  await db.vitals.put({ ...v, id });
  return id;
}

export async function upsertMed(med: Omit<Med, "id" | "createdAt" | "updatedAt"> & { id?: string }): Promise<string> {
  const now = new Date().toISOString();
  const id = med.id ?? generateId();
  const existing = med.id ? await db.meds.get(med.id) : undefined;
  const createdAt = existing?.createdAt ?? now;
  await db.meds.put({ id, createdAt, updatedAt: now, ...med });
  return id;
}

export async function upsertDose(dose: Omit<Dose, "id"> & { id?: string }): Promise<string> {
  const id = dose.id ?? generateId();
  await db.doses.put({ ...dose, id });
  return id;
}

export async function getLatestVitals(): Promise<Vitals | undefined> {
  return db.vitals.orderBy("at").last();
}

export function timeToTodayISO(timeHHmm: string): string {
  const [h, m] = timeHHmm.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

export async function ensureTodayDoses(): Promise<void> {
  const meds = await db.meds.toArray();
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const existing = await db.doses
    .where("plannedAt")
    .between(start.toISOString(), end.toISOString(), true, true)
    .toArray();
  const existingKey = new Set(existing.map((d) => `${d.medId}|${d.plannedAt}`));

  const planned: Dose[] = [];
  meds.forEach((m) => {
    m.schedule.forEach(({ time }) => {
      const plannedAt = timeToTodayISO(time);
      const key = `${m.id}|${plannedAt}`;
      if (!existingKey.has(key)) {
        planned.push({ id: generateId(), medId: m.id, plannedAt, takenAt: null, status: "planned" });
      }
    });
  });
  if (planned.length) await db.doses.bulkAdd(planned);
}

export async function plannedDosesAroundNow(windowMinutes = 180): Promise<Dose[]> {
  const now = new Date();
  const start = new Date(now.getTime() - windowMinutes * 60000).toISOString();
  const end = new Date(now.getTime() + windowMinutes * 60000).toISOString();
  return db.doses.where("plannedAt").between(start, end, true, true).toArray();
}
