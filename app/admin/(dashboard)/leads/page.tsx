import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LeadsInbox, type LeadRow } from "@/components/admin/LeadsInbox";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "العملاء المحتملين" };

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { supabase } = await requireAdmin();
  const { id } = await searchParams;
  const t = await getTranslations("admin.leads");
  const { data } = await supabase
    .from("leads")
    .select("id, name, phone, email, budget, message, status, source_page, locale, created_at, services(title_ar), branches(name_ar)")
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
    service: ((r.services as { title_ar?: string } | null)?.title_ar) ?? "",
    branch: ((r.branches as { name_ar?: string } | null)?.name_ar) ?? "",
  }));

  return (
    <>
      <PageHeader title={t("title")} />
      <LeadsInbox rows={rows} initialId={id ?? null} />
    </>
  );
}
