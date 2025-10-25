export default function DisclaimerPage() {
  return (
    <section className="col-span-full rounded-md border border-white/10 bg-[var(--card)] p-3">
      <h1 className="mb-2 text-[16px] font-semibold">Disclaimer</h1>
      <p className="text-[13px] text-[var(--text-muted)]">
        This tool is informational only. It does not store data in the cloud by default. By continuing,
        you agree not to enter sensitive personal information.
      </p>
    </section>
  );
}
