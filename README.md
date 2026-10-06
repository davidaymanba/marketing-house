# Marketing House — Website & Admin

Bilingual (Arabic default + English) agency website with a cinematic motion system and a Supabase-backed admin dashboard.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger · Motion (Framer Motion) · Lenis · React Three Fiber · next-intl · Supabase (Postgres, Auth, Storage) · react-hook-form + zod · Resend (optional).

---

## 1. Local setup

Requirements: **Node.js 20.9+** (developed on Node 24) and npm.

```bash
npm install
cp .env.example .env.local   # fill in the values (see below)
npm run dev                  # http://localhost:3000 → redirects to /en
```

The public site works **without Supabase**: it falls back to the seed content in `lib/content/seed.ts`. The admin and the contact form need Supabase.

| Script | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / server |
| `npm run typecheck` | TypeScript check |
| `npm run seed:generate` | Regenerates `supabase/seed.sql` from `lib/content/seed.ts` |

### Environment variables

| Variable | Where to find it | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API | Public; protected by RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API | **Server only.** Used only by the contact form Server Action |
| `RESEND_API_KEY` | resend.com → API Keys | Optional — emails new leads to the address in Site settings |
| `NEXT_PUBLIC_SITE_URL` | Your domain, e.g. `https://marketinghouse.com` | No trailing slash. Used for canonical URLs, sitemap, OG and JSON-LD |

---

## 2. Supabase setup

1. Create a project at [supabase.com](https://supabase.com) (region close to Egypt, e.g. Frankfurt).
2. **SQL Editor → New query** → paste and run `supabase/schema.sql`. Then run `supabase/seed.sql`.
   Both scripts are safe to re-run.
   This creates every table, Row Level Security policies, the `media` storage bucket, and the rate-limit function.
3. **Authentication → Providers → Email**: keep Email enabled.
   **Authentication → Sign In / Providers → "Allow new users to sign up": turn OFF.** Admins are created manually (next step).
4. Copy the URL and keys into `.env.local` (and later into Vercel).

### Security model (summary)

- Visitors can only **read published rows**. They cannot write anything, including `leads`.
- Leads are inserted only by the contact form's Server Action, using the service-role key, **after** the honeypot, minimum fill time, Postgres rate limit (5 per 10 minutes per hashed IP), and zod validation.
- An "admin" is a user with a row in the `admins` table. Being logged in grants nothing by itself.
  The proxy redirects anonymous users away from `/admin`. Every admin page and Server Action re-checks `is_admin()` on the server.

---

## 3. Create the first admin user

1. Supabase → **Authentication → Users → Add user → Create new user**: enter the email and a strong password and tick **Auto Confirm User**.
2. Copy the new user's **UID**, then in the **SQL Editor** run:

```sql
insert into public.admins (user_id) values ('PASTE-USER-UID-HERE');
```

3. Open `/admin/login` and sign in.

To add more admins, repeat the steps. To revoke one: `delete from public.admins where user_id = '...';`

---

## 4. Deploy to Vercel (step by step)

1. Push the project to a GitHub/GitLab/Bitbucket repository.
2. In [vercel.com](https://vercel.com) → **Add New… → Project** → import the repository. The framework is detected as Next.js automatically.
3. **Environment Variables**: add all five variables from the table above, for Production (and Preview if you want).
   Set `NEXT_PUBLIC_SITE_URL` to the final domain, or to the `*.vercel.app` URL until the domain is connected.
4. Click **Deploy**.
5. After the first deploy, open `https://YOUR-DOMAIN/admin/login` and sign in with the admin user.

Content edited in the admin appears on the public site right away: pages are statically generated, and every save revalidates them (`revalidateTag` + `revalidatePath`).

## 5. Custom domain

1. Vercel → Project → **Settings → Domains → Add** → enter `marketinghouse.com` (and `www.marketinghouse.com`).
2. At your domain registrar, create the DNS records Vercel shows. Usually:
   - `A` record `@` → `76.76.21.21`
   - `CNAME` record `www` → `cname.vercel-dns.com`
3. Wait for verification (minutes to a few hours). Vercel issues the HTTPS certificate automatically.
4. Update `NEXT_PUBLIC_SITE_URL` to `https://marketinghouse.com` and **redeploy**.
5. Supabase → Authentication → **URL Configuration**: set the Site URL to the same domain.

---

## 6. Project structure

```
app/[locale]/(site)/…    public pages (ar/en): home, services, portfolio, about, contact, 404
app/[locale]/opengraph-image.tsx   dynamic branded OG images (Arabic-safe)
app/admin/…              dashboard (English by default, Arabic via toggle): login, overview, leads, CRUD, settings
app/actions/lead.ts      contact form Server Action
app/sitemap.ts, robots.ts
components/motion        RevealText, RevealImage, Magnetic, Marquee, Parallax, Counter,
                         SpotlightCard, TiltCard, StackingCards, HorizontalScroll, ShineBadge, EgyptMap…
components/sections      page sections
components/three         R3F hero scene (desktop only, lazy-loaded)
components/layout        navbar, footer, preloader, cursor, scroll progress, WhatsApp button
components/admin         dashboard UI (generic ResourceManager drives all CRUD screens)
lib/admin/resources.ts   declarative admin resources (same config validates on the server)
lib/data.ts              public data access (Supabase → seed fallback, ISR-cached)
lib/motion.ts            motion tokens + diagonal wipe helpers
messages/ar.json, en.json  all UI strings
supabase/schema.sql, seed.sql
```

## 7. Content notes

- Projects, testimonials, client logos and team members are **placeholders** (`is_placeholder = true`). The site and the admin show a "Sample" badge on them. Replace them from the admin.
- Commercial registration and tax card numbers are empty until you add them in **Admin → Settings**. Until then the site shows the badge text without a number.
- The stats numbers (projects, clients, years, campaigns) are sample values. Update them in **Admin → Settings**.
- Images uploaded in the admin go to the public `media` bucket in Supabase Storage.
