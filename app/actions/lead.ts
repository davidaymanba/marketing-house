"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { leadSchema, type LeadInput } from "@/lib/validations/lead";

export type LeadResult =
  | { ok: true }
  | { ok: false; error: "validation" | "rateLimit" | "generic"; fields?: Partial<Record<keyof LeadInput, string>> };

type Payload = LeadInput & {
  /** Honeypot — real users never fill this. */
  website?: string;
  /** ms timestamp when the form was first rendered. */
  startedAt?: number;
  locale?: string;
  sourcePage?: string;
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MIN_FILL_MS = 3000;
const RATE_LIMIT = 5;
const RATE_WINDOW_S = 600;

export async function submitLead(payload: Payload): Promise<LeadResult> {
  // 1. Bots: honeypot filled or submitted inhumanly fast → pretend success.
  if (payload.website) return { ok: true };
  if (!payload.startedAt || Date.now() - payload.startedAt < MIN_FILL_MS) return { ok: true };

  // 2. Server-side validation (never trust the client).
  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) {
    const fields: Partial<Record<keyof LeadInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof LeadInput;
      fields[key] ??= issue.message;
    }
    return { ok: false, error: "validation", fields };
  }
  const lead = parsed.data;

  const supabase = createAdminClient();
  if (!supabase) {
    console.warn("[lead] Supabase not configured — lead not stored:", { ...lead, phone: "***" });
    return { ok: true };
  }

  // 3. Rate limit per hashed IP (Postgres-backed; in-memory doesn't work on Vercel).
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const salt = process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(-16) ?? "";
  const ipHash = createHash("sha256").update(`${salt}:${ip}`).digest("hex");

  const { data: allowed, error: rlError } = await supabase.rpc("check_rate_limit", {
    p_key: `lead:${ipHash}`,
    p_limit: RATE_LIMIT,
    p_window_seconds: RATE_WINDOW_S,
  });
  if (rlError) console.error("[lead] rate limit check failed", rlError.message);
  if (allowed === false) return { ok: false, error: "rateLimit" };

  // 4. Store.
  const { error } = await supabase.from("leads").insert({
    name: lead.name,
    phone: lead.phone,
    email: lead.email || null,
    service_id: UUID.test(lead.serviceId) ? lead.serviceId : null,
    branch_id: UUID.test(lead.branchId) ? lead.branchId : null,
    budget: lead.budget || null,
    message: lead.message,
    locale: payload.locale === "en" ? "en" : "ar",
    source_page: payload.sourcePage?.slice(0, 200) ?? null,
    ip_hash: ipHash,
  });
  if (error) {
    console.error("[lead] insert failed", error.message);
    return { ok: false, error: "generic" };
  }

  // 5. Optional email notification (never blocks success).
  await notifyByEmail(lead).catch((e) => console.error("[lead] email failed", e));
  return { ok: true };
}

async function notifyByEmail(lead: { name: string; phone: string; email: string; message: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const supabase = createAdminClient();
  const { data } = (await supabase?.from("site_settings").select("email").limit(1).maybeSingle()) ?? { data: null };
  const to = (data as { email?: string } | null)?.email || "marketinghouse969@gmail.com";
  const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Marketing House <onboarding@resend.dev>",
      to: [to],
      subject: `New lead: ${lead.name}`,
      html: `<h2>New lead</h2><p><b>Name:</b> ${escape(lead.name)}</p><p><b>Phone:</b> ${escape(lead.phone)}</p><p><b>Email:</b> ${escape(lead.email || "-")}</p><p><b>Message:</b><br>${escape(lead.message).replace(/\n/g, "<br>")}</p>`,
    }),
  });
}
