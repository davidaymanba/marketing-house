# ROLE
You are a world-class Creative Developer and Senior Full-Stack Engineer.
You build Awwwards "Site of the Day" level agency websites: cinematic design,
rich motion, buttery 60fps performance, and clean production-ready TypeScript.
Every section must feel crafted, never like a template.

# PROJECT
Build a complete bilingual (Arabic default + English) website and admin system for
"Marketing House" — a full-service, officially registered marketing agency in Egypt
with 3 branches (Giza, Cairo, Assiut).
Tagline: "We Build Brands"
Pillars: "Strategy. Creativity. Media. Performance."
Must be deployable to Vercel with only environment variables to configure.

=====================================================================
# 1. BRAND IDENTITY (follow strictly)
=====================================================================

## Logo
- /public/logo.png       → circular badge version
- /public/logo-mark.png  → the mark only: three slanted parallelogram bars forming a stylized "M" / roof
- Source files currently live in the project root (logo.jpg + the cover .png). In Phase 1,
  move them into /public and export optimized versions (PNG/WebP + favicon/app icons).
- Recreate the mark as an inline SVG React component <LogoMark /> where each of the
  3 bars is a separate <path> so they can be animated individually.
- Bars use the signature gradient (deep violet bottom-left → bright lavender top-right).

## Color tokens (CSS variables + Tailwind theme)
--bg:            #0B0717   main background (near-black, violet tint)
--bg-elevated:   #140C2B   cards & alternate sections
--surface:       #1C1238   inputs, hover states
--primary:       #7C3AED   brand purple (buttons, lines, "HOUSE")
--primary-light: #A855F7   gradient highlight
--glow:          #C084FC   glows, highlights, cursor
--primary-deep:  #4C1D95   gradient base, shadows
--text:          #FFFFFF
--text-muted:    #B8B0D0
--border:        rgba(168, 85, 247, 0.18)

Signature gradient:  linear-gradient(135deg, #4C1D95 0%, #7C3AED 50%, #C084FC 100%)
Glow shadow:         0 0 60px -10px rgba(168, 85, 247, 0.55)
Text gradient:       same signature gradient with background-clip:text

## Typography (next/font/google)
- Eyebrow labels (EN): "Syncopate" 700, uppercase, letter-spacing 0.4em, small size
  (mirrors the wide spacing of "M A R K E T I N G" in the logo).
- Headings & body (EN): "Plus Jakarta Sans" — headings 800, tight tracking (-0.03em).
- Arabic: "IBM Plex Sans Arabic" — headings 700, body 400, line-height 1.8.
- Arabic eyebrows: IBM Plex Sans Arabic 600, NO letter-spacing (tracking breaks Arabic
  letter joining). Never apply wide/negative tracking or uppercase styles to Arabic text.
- Brand wordmark "MARKETING HOUSE" (preloader, footer) stays in English in both locales.
- Fluid type scale with clamp(): display headings clamp(3rem, 8vw, 8.5rem).

## Visual language
- Dark, premium, cinematic. Lots of negative space. Big bold typography.
- Diagonal shapes at the logo's angle (~52°) used for dividers, masks, and reveals.
- Thin purple hairlines (like the lines beside "HOUSE") as section separators.
- Subtle animated film-grain noise overlay across the whole site (very low opacity).
- Soft radial purple glows ("light leaks") behind key content.
- Diagonal fine-line patterns at section edges (like the Facebook cover).
- Angular architectural purple shapes (skyscraper-like prisms) in the hero.
- Glassmorphism cards: bg-elevated/60, backdrop-blur-xl, 1px border, inner highlight.
- Radius: 20px cards, full-pill buttons. 8px spacing grid.

=====================================================================
# 2. TECH STACK
=====================================================================
- Next.js latest stable (App Router, Server Components, Server Actions) + TypeScript strict
- Tailwind CSS v4 (CSS-first @theme tokens) + shadcn/ui (fully restyled to the brand tokens)
- Pin exact versions of all dependencies in package.json at setup (no "latest" ranges).
- Motion:
  - GSAP + ScrollTrigger + "split-type" for scroll choreography
  - Framer Motion for component-level & page transitions
  - Lenis for smooth scrolling (synced with ScrollTrigger)
  - React Three Fiber + drei for ONE hero 3D scene (lazy-loaded)
- next-intl: /en (default, dir="ltr") and /ar (dir="rtl"); logical CSS properties everywhere
- Supabase: Postgres, Auth, Storage
- react-hook-form + zod, Resend (optional), lucide-react, sonner (toasts)

=====================================================================
# 3. MOTION SYSTEM (very important — the site must feel alive)
=====================================================================

## Global motion tokens (lib/motion.ts)
- Easings: expoOut [0.16, 1, 0.3, 1], smooth [0.65, 0, 0.35, 1]
- Durations: fast 0.3s, base 0.6s, slow 1.2s, cinematic 1.8s
- Stagger: 0.06s (letters/words), 0.12s (cards)
- Only animate transform, opacity, clip-path, filter — never layout properties.
  Exception: accordions animate via CSS grid-template-rows (0fr → 1fr), not height;
  Framer Motion `layout` is allowed (it uses transforms internally).

## Global effects
1. PRELOADER (first visit only, sessionStorage flag):
   The 3 logo bars slide in one by one along their diagonal, a 0→100% counter runs,
   "MARKETING HOUSE" letters reveal with wide letter-spacing collapsing to normal,
   then the preloader exits with a diagonal clip-path wipe revealing the hero.
   Max 2.5s. Skippable on click.
2. PAGE TRANSITIONS: diagonal purple panel (logo angle) sweeps across the screen
   between routes with the LogoMark pulsing in the center.
3. CUSTOM CURSOR (desktop only): small glowing dot + lagging ring;
   ring grows and shows a label ("View", "Drag", "اتصل") over interactive elements;
   blend-mode difference over images. Hidden on touch devices.
4. MAGNETIC BUTTONS: CTAs pull toward the cursor and spring back; inner text moves
   at a different strength; animated gradient border on hover.
5. SMOOTH SCROLL with Lenis + a thin gradient scroll-progress bar at the top.
6. SCROLL REVEALS: headings split into lines/words that slide up from a mask;
   paragraphs fade-up; images reveal with a diagonal clip-path + scale (1.2 → 1).
7. ANIMATED BACKGROUND: slow-moving purple gradient mesh/blobs + grain, reacting slightly to mouse.
8. MARQUEES: infinite, direction & speed react to scroll velocity, pause on hover.
9. NAVBAR: transparent over hero → glass on scroll; hides on scroll-down, shows on scroll-up;
   fullscreen mobile menu with staggered big links and diagonal background wipe.
10. HOVER MICRO-INTERACTIONS everywhere: card tilt (3D perspective), spotlight glow
    following the mouse inside cards, underline draw on links, icon morphs,
    image zoom inside masks.

## ARABIC / RTL MOTION RULES (critical)
- NEVER split Arabic text into characters (it breaks letter joining). Split Arabic by WORDS
  or LINES only. English may be split by characters.
- Mirror all horizontal motion in RTL (slide directions, horizontal scroll, marquees).

## Accessibility & performance for motion
- Respect prefers-reduced-motion: disable preloader, smooth scroll, parallax, cursor;
  keep simple fades.
- On mobile: disable custom cursor, 3D tilt, and the R3F scene (replace with a static
  optimized image/CSS version); keep reveals lighter.
- Lazy-load GSAP-heavy sections & the 3D scene with dynamic imports.
- Kill ScrollTriggers on unmount; no memory leaks; target constant 60fps.

=====================================================================
# 4. PUBLIC PAGES & SECTION-BY-SECTION DESIGN
=====================================================================

## 4.1 Home (/)
1. HERO (100vh)
   - Eyebrow: "MARKETING AGENCY — EGYPT" in Syncopate.
   - Giant headline: AR "نبني براندات تكبر" / EN "WE BUILD BRANDS"
     ("BRANDS" / "براندات" in text gradient). Line-by-line mask reveal after preloader.
   - Sub-line: the 4 pillars appearing one by one with a dot separator.
   - 2 magnetic CTAs: "ابدأ مشروعك" (primary gradient) + "شوف أعمالنا" (ghost).
   - Side visual: React Three Fiber scene — 3 extruded glossy violet bars of the LogoMark
     floating, slowly rotating, reacting to mouse with parallax, bloom glow,
     angular glass prisms behind them.
   - Scroll indicator with animated line.
   - On scroll: hero content scales down & fades, 3D bars drift apart (parallax).
2. CLIENTS MARQUEE: two rows moving in opposite directions, logos grayscale → color on hover.
3. INTRO STATEMENT: one big paragraph where words light up from muted to white
   as the user scrolls (scroll-scrubbed text highlight).
4. SERVICES — "STACKING CARDS": each service is a large card that pins and stacks over
   the previous one while scrolling: number (01, 02…), icon, title, short text, tags,
   arrow link. Spotlight glow on hover.
5. PROCESS — PINNED SECTION: Strategy → Creativity → Media → Performance.
   Section pins; a diagonal progress line draws; each step animates in on scroll;
   background glow shifts per step.
6. STATS: animated counters (projects, clients, years, campaigns, "3 branches")
   counting up when in view, with "+" and diagonal accents.
7. TRUST STRIP — "Officially Registered / شركة مسجلة رسمياً":
   2 badges (Commercial Registration + Tax Card) with shield/document icons,
   shine sweep animation across the badges.
8. FEATURED WORK — HORIZONTAL SCROLL: section pins and projects move horizontally
   (reversed in RTL); images parallax inside their masks; cursor shows "View".
9. TESTIMONIALS: draggable carousel with large quote, client photo & logo, inertia.
10. BRANCHES — "فروعنا / Our Branches": 3 glass cards (Giza, Cairo, Assiut) with staggered
    reveal: city name in big type, address, phone, "Get directions" button.
    Beside them a minimal stylized SVG map of Egypt with 3 glowing pulsing pins that
    light up when hovering the matching card.
11. CTA BAND: huge text "خلّينا نبني براندك" with infinite marquee behind it,
    signature gradient background with animated diagonal stripes, magnetic button.
12. FOOTER: giant "MARKETING HOUSE" wordmark revealing on scroll (letters rise from mask),
    links, the 3 branch addresses, contact info, socials with hover animations,
    legal line "سجل تجاري رقم: ... | بطاقة ضريبية رقم: ...", back-to-top button.

## 4.2 Services (/services)
Hero with split-text headline; services as an interactive list where hovering a row
shows a floating image following the cursor (hover-reveal list); line-draw dividers.

## 4.3 Service detail (/services/[slug])
Hero with big title + diagonal image reveal, "What we deliver" grid with staggered cards,
mini process steps, related projects slider, FAQ accordion with smooth height animation, CTA.
Seed services:
Branding & Visual Identity, Social Media Management, Content Creation,
Photography & Video Production, Media Buying / Paid Ads, Performance Marketing,
Web Design & Development, SEO.

## 4.4 Portfolio (/portfolio)
Animated category filter (sliding active pill, items re-layout with Framer Motion layout
animations), masonry grid, image reveal on scroll, hover: zoom + title slide-up + tilt.

## 4.5 Project detail (/portfolio/[slug])
Fullscreen cover with parallax, sticky project info sidebar (client, year, services),
Challenge / Solution / Results with animated result numbers, gallery with scroll reveals
and a lightbox, big "Next project" hover link that transitions with an image-expand animation.

## 4.6 About (/about)
Story with scroll-scrubbed text highlight, mission/vision cards, values with icons,
milestones timeline drawn on scroll, team grid (grayscale → color + socials slide in),
"3 branches across Egypt" highlighted stat, and a "Legal Information / البيانات القانونية"
block showing Commercial Registration and Tax Card numbers with badge icons.

## 4.7 Contact (/contact)
Split layout: big headline + contact cards (phone, WhatsApp, email) with copy-to-clipboard
micro-animation; glass form with floating labels, animated focus borders, validation,
a "Preferred branch" select, and an animated success state (checkmark draw + brand-color confetti).
Branch switcher tabs (Giza / Cairo / Assiut) with a sliding active pill: switching a tab
animates the address card and crossfades the dark-styled Google Map embed.
Working hours per branch.

## 4.8 Global
- Floating WhatsApp button with pulse ring animation (all pages).
- Custom 404: giant "404" built from the logo bars falling apart, CTA back home.

=====================================================================
# 5. COMPANY DATA, BRANCHES & LEGAL (editable from admin; seed with)
=====================================================================

## Branches ("branches" table)
1. Giza Branch
   - AR: مساكن دهشور، حدائق أكتوبر – الجيزة
   - EN: Dahshur Housing, Hadayek October – Giza
2. Cairo Branch
   - AR: ٢٠ شارع الحجاز، مصر الجديدة – القاهرة
   - EN: 20 El Hegaz St., Heliopolis – Cairo
3. Assiut Branch
   - AR: ١٤ شارع الجمهورية – أسيوط
   - EN: 14 El Gomhoreya St. – Assiut

Columns: name_ar, name_en, city_ar, city_en, address_ar, address_en, phone, whatsapp,
map_embed_url, map_link, working_hours_ar, working_hours_en, is_main, sort_order, is_published.
Seed all branches with the main phone until per-branch phones are added.

## Main contact (site_settings)
- Phone: 01283495495 → tel:+201283495495
- WhatsApp: https://wa.me/201283495495
- Email: marketinghouse969@gmail.com
- Social handle: /marketinghouse (Facebook, Instagram, LinkedIn — URLs editable)

## Legal & trust (site_settings)
The company is officially registered with:
- Commercial Registration (سجل تجاري) → field: commercial_reg_no
- Tax Card (بطاقة ضريبية) → field: tax_card_no
Both editable from admin. If a number is empty, show the badge text
("مسجلة بسجل تجاري" / "حاصلة على بطاقة ضريبية") without a number.

=====================================================================
# 6. ADMIN DASHBOARD (/admin, protected)
=====================================================================
Design: same brand, calmer motion (fast fades, subtle hovers), English/LTR by default with an Arabic/RTL toggle (cookie), collapsible sidebar.
- Login: Supabase Auth email/password, branded split-screen login with animated LogoMark.
- Overview: KPI cards (new leads this week, total leads, projects, conversion rate),
  leads chart (last 30 days), leads per branch, latest leads table.
- Leads inbox: search, filter by status (New / Contacted / Qualified / Won / Lost) and by branch,
  detail drawer with notes timeline, one-click WhatsApp/call, export CSV, new-lead badge.
- CRUD with bilingual fields (ar/en), image upload with preview (Supabase Storage),
  drag-to-reorder, publish/draft toggle, for:
  Services, Projects (categories + gallery), Testimonials, Team members, Client logos, Branches.
- Site settings: contact info, socials, stats numbers, legal numbers, SEO defaults.
- Toasts, skeleton loaders, confirm dialogs, optimistic updates.
- Middleware protects all /admin routes (session check), AND every admin Server Action /
  data query re-checks is_admin() server-side — never trust the middleware alone.

=====================================================================
# 7. DATABASE
=====================================================================
/supabase/schema.sql with tables:
services, projects, project_categories, project_images, testimonials,
team_members, clients, branches, leads (with branch_id), lead_notes, site_settings,
admins, rate_limits.
- Bilingual columns: title_ar, title_en, description_ar, description_en, slug.
- Common columns: is_published, sort_order, created_at, updated_at (auto via trigger).
- Content columns required by the pages:
  - services: icon, tags, cover_image, deliverables (jsonb [{title_ar,title_en,text_ar,text_en}]),
    process_steps (jsonb), faqs (jsonb [{q_ar,q_en,a_ar,a_en}]), short_text_ar/en.
  - projects: category_id, client_ar/en, year, service_slugs (text[]), cover_image,
    challenge_ar/en, solution_ar/en, results (jsonb [{value, suffix, label_ar, label_en}]),
    is_featured, is_placeholder.
  - testimonials / team_members / clients: photo or logo, role_ar/en, socials (jsonb), is_placeholder.
  - leads: name, phone, email, service_id, branch_id, budget, message, source_page, locale,
    status (enum: new/contacted/qualified/won/lost), ip_hash, created_at.
  - lead_notes: lead_id, author_id, body, created_at (powers the notes timeline).
  - admins: user_id (references auth.users), created_at.
  - rate_limits: key (hashed IP + action), window_start, count.
- Row Level Security:
  - anon: SELECT published rows only. NO direct insert anywhere.
  - Admin = a row exists in `admins` for auth.uid() (helper SQL function is_admin()).
    Only is_admin() gets full access. Being "authenticated" alone grants nothing.
  - leads are inserted ONLY by the contact Server Action using the service-role key, after
    honeypot + rate-limit + zod checks. Service-role key is server-only, never imported in client code.
  - Public sign-ups disabled in Supabase Auth; the first admin is created manually (see README).
- Storage: one public "media" bucket; uploads/deletes allowed for is_admin() only.
/supabase/seed.sql: all data above + realistic placeholder projects/testimonials
clearly marked as placeholders.
Public pages use ISR + revalidatePath after admin edits.

=====================================================================
# 8. QUALITY REQUIREMENTS
=====================================================================
- Fully responsive 360px → 2560px, mobile-first, every animation tested on mobile.
- Lighthouse 90+ (performance, accessibility, best practices, SEO) despite the motion:
  lazy-load heavy libs, next/image with blur placeholders, font-display swap, CLS < 0.1.
- SEO: per-page metadata (ar/en), hreflang, dynamic OG images in brand style,
  sitemap.xml, robots.txt, JSON-LD: one "MarketingAgency" Organization with
  3 "LocalBusiness" locations (one per branch) and taxID when filled.
- Accessibility: semantic HTML, visible focus states, aria labels, AA contrast, keyboard nav.
- Lead form: honeypot + minimum fill-time check + rate limiting (Postgres `rate_limits`
  table, e.g. 5 submissions / 10 min per hashed IP — in-memory limits don't work on Vercel)
  + server-side zod validation + Egyptian phone format validation.
- All UI strings in /messages/ar.json and /messages/en.json (no hard-coded copy).
- Reusable animation components: <RevealText>, <RevealImage>, <Magnetic>, <Marquee>,
  <Parallax>, <Counter>, <SpotlightCard>, <TiltCard>, <StackingCards>,
  <HorizontalScroll>, <ShineBadge>, <EgyptMap>.

=====================================================================
# 9. PROJECT STRUCTURE
=====================================================================
app/[locale]/(site)/...        public pages
app/admin/...                  dashboard (English/LTR default, Arabic/RTL via a cookie toggle; outside [locale]; excluded from
                               the next-intl middleware matcher)
components/ui                  shadcn (restyled)
components/motion              animation primitives
components/sections            page sections
components/three               R3F hero scene
lib/supabase, lib/validations, lib/motion.ts
messages/ar.json, messages/en.json
supabase/schema.sql, supabase/seed.sql

=====================================================================
# 10. DELIVERABLES
=====================================================================
1. Complete source code.
2. .env.example: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
   SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, NEXT_PUBLIC_SITE_URL
3. README: local setup, Supabase setup, creating the first admin user,
   step-by-step Vercel deployment, custom domain setup.

=====================================================================
# 11. WORK PLAN (build in phases, confirm each before continuing)
=====================================================================
Phase 1: setup, design tokens, fonts, i18n/RTL, LogoMark SVG, motion primitives,
         Lenis, cursor, navbar, footer, preloader, page transitions.
Phase 2: Home page — all sections with full animations (static seed data).
Phase 3: Services, Portfolio, About, Contact, 404 pages with animations.
Phase 4: Supabase schema, connect pages to DB, lead form.
Phase 5: Admin dashboard.
Phase 6: performance, reduced-motion, mobile, SEO, accessibility polish, README.

Before writing code in each phase, briefly state the plan for that phase.
Do not skip animations or replace them with simple fades — motion is a core requirement.

=====================================================================
# 12. TECHNICAL DECISIONS (resolve conflicts — these win over earlier sections)
=====================================================================

## Performance vs. motion
- PRELOADER must not hurt LCP: the hero is server-rendered and painted underneath; the
  preloader is a fixed overlay on top. Never delay hero HTML/fonts until the preloader ends.
  Inline the preloader's critical CSS so it shows before JS hydrates.
- R3F scene loads via next/dynamic (ssr:false) only on desktop + no reduced-motion, after
  first paint (requestIdleCallback). A static WebP/CSS version of the bars is shown
  first and crossfades to the 3D scene once it's ready. Cap DPR at 1.5; pause rendering
  (frameloop="demand" / IntersectionObserver) when the hero is off-screen.
- GSAP owns scroll choreography; Framer Motion owns component state/layout/transitions.
  Don't animate the same element with both. Register GSAP plugins once in a client provider.
- Grain overlay: a tiny tiled noise PNG animated with transform steps — not a
  full-screen canvas or SVG filter recalculated every frame.

## Home page pinned sections
- Desktop: Stacking Cards, Process and Featured Work stay pinned as designed.
- Mobile (< 768px) and reduced-motion: Process becomes a vertical timeline with reveals
  (no pin), and Featured Work becomes a native swipeable scroll-snap row (no pin).
  Stacking cards keep a lighter sticky-CSS version. Use gsap.matchMedia() for this split.

## Lenis + ScrollTrigger + RTL
- One Lenis instance driven by gsap.ticker; call ScrollTrigger.refresh() after fonts and
  images load and on locale change. Disable Lenis inside the admin, modals and the lightbox.
- RTL horizontal scroll: compute direction from document.dir; animate x to a positive value
  in RTL instead of relying on the browser's RTL scrollLeft behavior.

## Page transitions
- Implement with a TransitionProvider: a custom <TransitionLink> that plays the diagonal
  panel "cover" animation → router.push → "reveal" animation on the new route (via
  template.tsx / pathname change). Browser back/forward plays only the reveal.
  Skip entirely under reduced-motion.

## RTL & components
- Wrap the app in Radix DirectionProvider with the current dir so shadcn dropdowns,
  sliders, tabs and drawers open in the correct direction.
- Use logical utilities only (ms-/me-/ps-/pe-/start-/end-); directional icons (arrows)
  flip with rtl:-scale-x-100.
- Numbers: Western digits (0-9) for phones, stats and counters in both locales for
  consistency; Arabic copy stays in Arabic.

## Maps
- Google Maps iframes can't be themed. Use the standard embed with a CSS filter
  (invert + hue-rotate + grayscale) to match the dark theme, loaded lazily
  (loading="lazy", only after the Contact page map comes into view). No API key needed.

## OG images
- Dynamic OG images (next/og) must load IBM Plex Sans Arabic as an ArrayBuffer for
  Arabic titles, otherwise Arabic renders as boxes. Set dir/lang correctly in the template.

## i18n details
- Root "/" redirects to "/en". localePrefix: "always". Slugs are shared across locales
  (English slugs). Language switcher keeps the current path.
- hreflang alternates for ar, en and x-default (→ en) on every page.

## Content & assets
- No real project photos/logos/team photos exist yet. Use clearly marked placeholders
  (is_placeholder = true) with brand-styled generated visuals (gradients + LogoMark
  patterns), not random stock photos. The admin shows a "Placeholder" badge on these rows.
- Never fabricate commercial registration or tax numbers — leave empty until the client
  provides them (badge text without a number, per section 5).

## Implementation notes (decided during the build)
- Next.js 16: middleware is `proxy.ts` (next-intl for public routes + Supabase session gate for /admin).
- Content source of truth for seeds: `lib/content/seed.ts` → `npm run seed:generate` writes `supabase/seed.sql`.
  `lib/data.ts` reads Supabase (cached fetch tagged "content") and falls back to the seed when Supabase is unset.
- Admin CRUD is config-driven: `lib/admin/resources.ts` defines fields once; the same config builds the UI
  (`components/admin/ResourceManager.tsx`) and the server zod schema (`lib/admin/validate.ts`).
- Logo geometry lives in `lib/brand.ts` (plain module) so server code (OG images) can use it.
- OG images: Satori shapes Arabic but doesn't reorder RTL words — render Arabic word-by-word in a row-reverse flex.
- Fonts: Jakarta (variable) is first in every stack; Plex Sans Arabic (arabic subset, 400/700) only supplies Arabic glyphs.
- Intro text waiting for the preloader uses `data-reveal="preloader"` so it stays painted under the overlay (LCP).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
