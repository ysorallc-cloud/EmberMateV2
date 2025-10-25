"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Dashboard" },
  { href: "/check-in", label: "Check-In" },
  { href: "/meds", label: "Meds" },
  { href: "/vitals", label: "Vitals" },
  { href: "/settings", label: "Settings" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[var(--surface)] px-3 py-2">
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-semibold tracking-wide">Care Minimal</span>
          <span className="rounded bg-[var(--card)] px-2 py-0.5 text-[11px] text-[var(--text-muted)]">MVP</span>
        </div>
        <nav className="flex items-center gap-2 text-[12px]">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded px-2 py-1 hover:bg-white/5 ${pathname === n.href ? "bg-white/10" : ""}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
      <div className="bg-[var(--bg)]">
        <Banner />
        <main className="mx-auto grid w-full max-w-5xl gap-3 p-3 sm:grid-cols-2 lg:grid-cols-4">
          {children}
        </main>
      </div>
    </div>
  );
}

function Banner() {
  return (
    <div className="bg-[var(--card)] px-3 py-2 text-[12px] text-[var(--text-muted)]">
      This is not HIPAA-compliant. Don’t enter names, addresses, DOB, or other sensitive data.
      <span className="ml-2">
        <Link className="underline" href="/legal/disclaimer">Learn more</Link>
      </span>
    </div>
  );
}
