"use client";
import { useEffect, useState } from "react";
import { getAppSettings, setDisclaimerAccepted } from "../lib/db";

export function DisclaimerGate() {
  const [needsAck, setNeedsAck] = useState(false);

  useEffect(() => {
    getAppSettings().then((s) => setNeedsAck(!s.disclaimerAccepted));
  }, []);

  if (!needsAck) return null;
  return (
    <div role="dialog" aria-modal className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-md border border-white/10 bg-[var(--card)] p-4 text-[13px]">
        <h2 className="mb-2 text-[16px] font-semibold">Please read and accept</h2>
        <p className="text-[12px] text-[var(--text-muted)]">
          This tool is informational only. It does not store data in the cloud by default. By
          continuing, you agree not to enter sensitive personal information.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="rounded bg-[var(--accent)] px-3 py-1.5 text-[12px] font-semibold text-black hover:opacity-90"
            onClick={async () => {
              await setDisclaimerAccepted();
              setNeedsAck(false);
            }}
          >
            I understand
          </button>
        </div>
      </div>
    </div>
  );
}
