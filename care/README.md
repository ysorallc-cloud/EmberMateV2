Care Minimal — Offline-first caregiver tracker (MVP)

Important: This app is not HIPAA-compliant. Do not enter names, addresses, DOB, or other sensitive personal data.

Quick start

```bash
npm install
npm run dev
# visit http://localhost:3000
```

Tech stack
- Next.js 14 (App Router), TypeScript
- Tailwind CSS (dark-first tokens)
- IndexedDB via Dexie (offline-first)
- React Hook Form + Zod
- Recharts (compact charts)
- Vitest + Testing Library; Playwright

Security and privacy
- Local-only by default; no analytics
- Strict CSP headers; no inline scripts
- PII guard blocks emails/phones/SSN/DOB/addresses and disallowed fields

Develop
- Seed demo data from Settings → Seed demo data
- Run unit tests: `npm test`
- Run e2e (start dev server in another terminal): `npx playwright test`

Selling this as a template
- Positioning: lightweight, offline-first health logging with strong disclaimers
- Include clear non-HIPAA notice in marketing and docs
- Provide instructions to enable optional analytics and future sync via env flags
