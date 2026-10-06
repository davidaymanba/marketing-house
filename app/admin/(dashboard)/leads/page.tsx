import { getTranslations } from "next-intl/server";
import { LeadsInbox, type LeadRow } from "@/components/admin/LeadsInbox";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { adminPick, getAdminLocale } from "@/lib/admin/locale";

export async function generateMetadata() {
  const t = await getTranslations("admin.leads");
  return { title: t("title") };
}

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { supabase } = await requireAdmin();
  const { id } = await searchParams;
  const t = await getTranslations("admin.leads");
  const locale = await getAdminLocale();
  const { data } = await supabase
    .from("leads")
    .select("id, name, phone, email, budget, message, status, source_page, locale, created_at, services(title_ar, title_en), branches(name_ar, name_en)")
    .order("created_at", { ascending: false })
    .limit(1000);

  const rows: LeadRow[] = ((data ?? []) as Record<string, unknown>[]).map((r) => ({
    id: String(r.id),
    name: String(r.name),
    phone: String(r.phone),
    email: (r.email as string) ?? "",
    budget: (r.budget as string) ?? "",
    message: String(r.message ?? ""),
    status: String(r.status),
    source: (r.source_page as string) ?? "",
    createdAt: String(r.created_at),
    service: r.services ? adminPick(locale, (r.services as Record<string, string>).title_ar, (r.services as Record<string, string>).title_en) : "",
    branch: r.branches ? adminPick(locale, (r.branches as Record<string, string>).name_ar, (r.branches as Record<string, string>).name_en) : "",
  }));

  return (
    <>
      <PageHeader title={t("title")} />
      <LeadsInbox rows={rows} initialId={id ?? null} />
    </>
  );
}
