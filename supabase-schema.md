# Supabase schema (run in SQL Editor)

**Storage (required for intake PDF upload):**

1. In the Supabase dashboard go to **Storage** in the left sidebar.
2. Click **New bucket**.
3. Name: **`denials`** (exactly).
4. Choose **Public bucket** if you want the app to get a public URL for the uploaded PDF (recommended for viewing links); otherwise leave it private and use signed URLs later.
5. Click **Create bucket**.

After that, the intake wizard upload will work.

---

Run the following SQL in order in your project’s **SQL Editor** at [supabase.com/dashboard](https://supabase.com/dashboard) → your project → SQL Editor.

---

## 1. Tables

```sql
-- Claims / appeals pipeline
create table if not exists public.claims (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  status text not null check (status in ('drafted', 'agent_calling', 'in_review', 'overturned')),
  patient_name text,
  denial_date date,
  insurer text,
  extracted_data jsonb,
  appeal_letter text,
  pdf_url text
);

-- Live call transcripts (for terminal stream)
create table if not exists public.call_transcripts (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid references public.claims(id) on delete set null,
  created_at timestamptz default now(),
  role text check (role in ('agent', 'rep', 'system')),
  content text not null
);
```

---

## 2. Realtime (for Live Call Terminal)

```sql
alter publication supabase_realtime add table public.call_transcripts;
```

If you get “table is already in publication”, you can ignore it.

---

## 3. Row Level Security (RLS)

Enable RLS and add policies so the app can read/write with the **anon** key (no auth yet). When you add auth later, you can restrict by `auth.uid()`.

```sql
alter table public.claims enable row level security;
alter table public.call_transcripts enable row level security;

-- Claims: allow anon to select, insert, update (for demo; tighten when you add auth)
create policy "Allow anon read claims"
  on public.claims for select
  using (true);

create policy "Allow anon insert claims"
  on public.claims for insert
  with check (true);

create policy "Allow anon update claims"
  on public.claims for update
  using (true);

-- Transcripts: allow anon to select (for terminal) and insert (for Voice AI backend)
create policy "Allow anon read call_transcripts"
  on public.call_transcripts for select
  using (true);

create policy "Allow anon insert call_transcripts"
  on public.call_transcripts for insert
  with check (true);
```

---

## 3b. Storage RLS (for intake PDF upload)

Storage uses RLS on `storage.objects`. Without these policies, uploads to the `denials` bucket fail with “new row violates row-level security policy”. Run this in the SQL Editor:

```sql
-- Allow anyone to upload (insert) into the denials bucket
create policy "Allow anon upload to denials"
  on storage.objects for insert
  to public
  with check (bucket_id = 'denials');

-- Allow anyone to read from the denials bucket (for public URLs)
create policy "Allow public read from denials"
  on storage.objects for select
  to public
  using (bucket_id = 'denials');
```

---

## 4. Optional: auto-update updated_at

```sql
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger claims_updated_at
  before update on public.claims
  for each row execute function public.set_updated_at();
```
