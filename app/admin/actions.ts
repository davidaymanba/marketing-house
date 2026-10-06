"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { assertAdmin } from "@/lib/admin/auth";
import { isResourceKey, resources } from "@/lib/admin/resources";
import { buildSchema, toRow } from "@/lib/admin/validate";
import { CONTENT_TAG } from "@/lib/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string; fields?: Record<string, string> };

/** Public pages are ISR — refresh them after every content change. */
function refreshPublic() {
  revalidateTag(CONTENT_TAG, { expire: 0 });
  revalidatePath("/", "layout");
}

const fail = (e: unknown): ActionResult => {
  console.error("[admin]", e);
  return { ok: false, error: e instanceof Error ? e.message : "error" };
};

/* ------------------------------ resources ------------------------------- */

export async function saveResource(key: string, id: string | null, values: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    if (!isResourceKey(key)) throw new Error("Unknown resource");
    const { supabase } = await assertAdmin();
    const resource = resources[key];

    const parsed = buildSchema(resource).safeParse(values);
    if (!parsed.success) {
      const fields: Record<string, string> = {};
      for (const issue of parsed.error.issues) fields[issue.path.join(".")] ??= issue.message;
      return { ok: false, error: "validation", fields };
    }
    const data = parsed.data as Record<string, unknown>;
    const row = toRow(resource, data);

    let savedId = id;
    if (id) {
      const { error } = await supabase.from(resource.table).update(row).eq("id", id);
      if (error) throw error;
    } else {
      const { data: max } = await supabase.from(resource.table).select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
      const { data: inserted, error } = await supabase
        .from(resource.table)
        .insert({ ...row, sort_order: ((max as { sort_order?: number } | null)?.sort_order ?? -1) + 1 })
        .select("id")
        .single();
      if (error) throw error;
      savedId = (inserted as { id: string }).id;
    }

    // Project gallery lives in project_images: replace the set.
    if (key === "projects" && savedId && Array.isArray(data.gallery)) {
      await supabase.from("project_images").delete().eq("project_id", savedId);
      const urls = data.gallery as string[];
      if (urls.length) {
        const { error } = await supabase.from("project_images").insert(urls.map((url, i) => ({ project_id: savedId, url, sort_order: i })));
        if (error) throw error;
      }
    }

    refreshPublic();
    revalidatePath(`/admin/${key}`);
    return { ok: true, data: { id: savedId! } };
  } catch (e) {
    const msg = (e as { code?: string; message?: string })?.code === "23505" ? "duplicate" : undefined;
    return msg ? { ok: false, error: msg, fields: { slug: "duplicate" } } : (fail(e) as ActionResult<{ id: string }>);
  }
}

export async function deleteResource(key: string, id: string): Promise<ActionResult> {
  try {
    if (!isResourceKey(key)) throw new Error("Unknown resource");
    const { supabase } = await assertAdmin();
    const { error } = await supabase.from(resources[key].table).delete().eq("id", z.uuid().parse(id));
    if (error) throw error;
    refreshPublic();
    revalidatePath(`/admin/${key}`);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function togglePublished(key: string, id: string, value: boolean): Promise<ActionResult> {
  try {
    if (!isResourceKey(key)) throw new Error("Unknown resource");
    const { supabase } = await assertAdmin();
    const { error } = await supabase.from(resources[key].table).update({ is_published: value }).eq("id", z.uuid().parse(id));
    if (error) throw error;
    refreshPublic();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function reorderResource(key: string, ids: string[]): Promise<ActionResult> {
  try {
    if (!isResourceKey(key)) throw new Error("Unknown resource");
    const { supabase } = await assertAdmin();
    const list = z.array(z.uuid()).max(500).parse(ids);
    const table = resources[key].table;
    const results = await Promise.all(list.map((id, i) => supabase.from(table).update({ sort_order: i }).eq("id", id)));
    const failed = results.find((r) => r.error);
    if (failed?.error) throw failed.error;
    refreshPublic();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/* -------------------------------- leads --------------------------------- */

const statusSchema = z.enum(["new", "contacted", "qualified", "won", "lost"]);

export async function updateLeadStatus(id: string, status: string): Promise<ActionResult> {
  try {
    const { supabase } = await assertAdmin();
    const { error } = await supabase.from("leads").update({ status: statusSchema.parse(status) }).eq("id", z.uuid().parse(id));
    if (error) throw error;
    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function addLeadNote(leadId: string, body: string): Promise<ActionResult<{ id: string; body: string; created_at: string }>> {
  try {
    const { supabase, user } = await assertAdmin();
    const text = z.string().trim().min(1).max(4000).parse(body);
    const { data, error } = await supabase
      .from("lead_notes")
      .insert({ lead_id: z.uuid().parse(leadId), body: text, author_id: user.id })
      .select("id, body, created_at")
      .single();
    if (error) throw error;
    return { ok: true, data: data as { id: string; body: string; created_at: string } };
  } catch (e) {
    return fail(e) as ActionResult<{ id: string; body: string; created_at: string }>;
  }
}

export async function getLeadNotes(leadId: string): Promise<ActionResult<{ id: string; body: string; created_at: string }[]>> {
  try {
    const { supabase } = await assertAdmin();
    const { data, error } = await supabase
      .from("lead_notes")
      .select("id, body, created_at")
      .eq("lead_id", z.uuid().parse(leadId))
      .order("created_at", { ascending: true });
    if (error) throw error;
    return { ok: true, data: (data ?? []) as { id: string; body: string; created_at: string }[] };
  } catch (e) {
    return fail(e) as ActionResult<{ id: string; body: string; created_at: string }[]>;
  }
}

export async function deleteLead(id: string): Promise<ActionResult> {
  try {
    const { supabase } = await assertAdmin();
    const { error } = await supabase.from("leads").delete().eq("id", z.uuid().parse(id));
    if (error) throw error;
    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/* ------------------------------- settings ------------------------------- */

const settingsSchema = z.object({
  phone: z.string().trim().max(30),
  whatsapp: z.string().trim().regex(/^\d{8,15}$/, "invalid"),
  email: z.email("invalid").max(200),
  facebook: z.union([z.literal(""), z.url("invalid")]),
  instagram: z.union([z.literal(""), z.url("invalid")]),
  linkedin: z.union([z.literal(""), z.url("invalid")]),
  commercial_reg_no: z.string().trim().max(60),
  tax_card_no: z.string().trim().max(60),
  stat_projects: z.coerce.number().int().min(0),
  stat_clients: z.coerce.number().int().min(0),
  stat_years: z.coerce.number().int().min(0),
  stat_campaigns: z.coerce.number().int().min(0),
  seo_title_ar: z.string().trim().max(120),
  seo_title_en: z.string().trim().max(120),
  seo_description_ar: z.string().trim().max(320),
  seo_description_en: z.string().trim().max(320),
});

export async function saveSettings(values: unknown): Promise<ActionResult> {
  try {
    const { supabase } = await assertAdmin();
    const parsed = settingsSchema.safeParse(values);
    if (!parsed.success) {
      const fields: Record<string, string> = {};
      for (const issue of parsed.error.issues) fields[issue.path.join(".")] ??= issue.message;
      return { ok: false, error: "validation", fields };
    }
    const { error } = await supabase.from("site_settings").upsert({ id: 1, ...parsed.data });
    if (error) throw error;
    refreshPublic();
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/* --------------------------------- auth --------------------------------- */

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
