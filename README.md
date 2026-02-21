# Overturn

Appeal insurance denials with confidence. A high-end dashboard for uploading denial PDFs, managing appeal letters, moving claims through a pipeline, and watching live Voice AI call transcripts.

## Tech stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** with an **Organic / Natural** design system (Fraunces + Nunito, earth palette, grain texture, soft shadows)
- **Supabase** for data and realtime transcript streaming
- **Lucide React** for icons

## Quick start

```bash
npm install
cp .env.local.example .env.local
# Add your Supabase URL and anon key to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use **Open dashboard** to enter the command center.

## Supabase setup

1. **Create a project** at [supabase.com](https://supabase.com) → New project.
2. **Add env vars**: Copy `.env.local.example` to `.env.local`. In the Supabase dashboard go to **Settings → API** and set:
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL  
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public key  
3. **Create tables and policies**: Open **SQL Editor** in the dashboard and run the SQL in `supabase-schema.md` in order (tables → realtime → RLS policies → optional `updated_at` trigger). This creates `claims` and `call_transcripts` and allows the app to read/write with the anon key.
4. Restart the dev server after changing `.env.local`.

## Dashboard

- **Home (`/`)** — Landing with CTA to dashboard.
- **Dashboard (`/dashboard`)** — Command center overview and links to Intake, Claims, and Live Call Terminal.
- **Intake (`/dashboard/intake`)** — Split screen: left = PDF upload / highlighted document, right = editable extracted data + generated appeal letter.
- **Claims (`/dashboard/claims`)** — Kanban: **Drafted → Agent Calling → In Review → Overturned**. Drag cards between columns.
- **Live Call Terminal** — Floating widget (bottom-right). When the Voice AI is on a call, the dashboard can stream live transcript lines from Supabase `call_transcripts` (realtime). Open the widget to see the terminal-style view.

## Design system

The UI follows the **Organic / Natural** spec: off-white background (`#FDFCF8`), moss green primary (`#5D7052`), terracotta secondary (`#C18C5D`), Fraunces for headings, Nunito for body, pill buttons, soft colored shadows, and a global grain overlay. Components live in `src/components/ui/` and `src/app/globals.css` holds tokens and the grain.

## Scripts

- `npm run dev` — Dev server
- `npm run build` — Production build
- `npm run start` — Run production server
- `npm run lint` — ESLint
