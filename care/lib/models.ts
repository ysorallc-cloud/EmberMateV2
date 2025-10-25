export type ISODateString = string;

export interface Med {
  id: string;
  name: string;
  doseMg: number | null;
  unit: string;
  schedule: Array<{ time: string }>;
  notes?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export type DoseStatus = "planned" | "taken" | "skipped";

export interface Dose {
  id: string;
  medId: string;
  plannedAt: ISODateString;
  takenAt: ISODateString | null;
  status: DoseStatus;
}

export interface Vitals {
  id: string;
  at: ISODateString;
  bpSystolic?: number;
  bpDiastolic?: number;
  hr?: number;
  weightKg?: number;
  tempC?: number;
  spo2?: number;
  note?: string;
}

export interface Settings {
  id: "app";
  disclaimerAccepted: boolean;
  useVoice: boolean;
  hrRange?: [number, number];
  weightDeltaAlertPct?: number;
  heightCm?: number;
}
