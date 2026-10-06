import { Briefcase, Inbox, Sparkles, TrendingUp } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LeadsChart } from "@/components/admin/LeadsChart";
import { PageHeader, StatusBadge } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "نظرة عامة" };

export default async function OverviewPage() {
  const { supabase } = await requireAdmin();
  const t = await getTranslations("admin.overview");
  const tl = await getTranslations("admin.leads");

  const since30 = new Date(Date.now() - 29 * 864e5);
  since30.setHours(0, 0, 0, 0);
  const since7 = new Date(Date.now() - 7 * 864e5).toISOString();

  const [total, week, won, projects, recent, latest] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", since7),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "won"),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("created_at").gte("created_at", since30.toISOString()),
    supabase.from("leads").select("id, name, phone, status, created_at").order("created_at", { ascending: false }).limit(6),
  ]);

  const totalCount = total.count ?? 0;
  const conversion = totalCount ? Math.round(((won.count ?? 0) / totalCount) * 100) : 0;

  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(since30.getTime() + i * 864e5);
    return { date: d.toISOString().slice(0, 10), count: 0 };
  });
  for (const row of (recent.data ?? []) as { created_at: string }[]) {
    const key = row.created_at.slice(0, 10);
    const day = days.find((d) => d.date === key);
    if (day) day.count++;
  }

  const kpis = [
    { label: t("newLeads"), value: week.count ?? 0, Icon: Sparkles },
    { label: t("totalLeads"), value: totalCount, Icon: Inbox },
    { label: t("projects"), value: projects.count ?? 0, Icon: Briefcase },
    { label: t("conversion"), value: `${conversion}%`, Icon: TrendingUp, hint: t("conversionHint") },
  ];

  return (
    <>
      <PageHeader title={t("title")} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ label, value, Icon, hint }) => (
          <div key={label} className="rounded-card border border-line bg-bg-elevated/60 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">{label}</p>
              <span className="grid size-9 place-items-center rounded-xl bg-primary/15 text-glow">
                <Icon aria-hidden className="size-4" />
              </span>
            </div>
            <p className="mt-4 text-3xl font-extrabold" dir="ltr">
              {value}
            </p>
            {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-5">
        <section className="rounded-card border border-line bg-bg-elevated/60 p-5 xl:col-span-3">
          <h2 className="mb-4 font-bold">{t("chartTitle")}</h2>
          <LeadsChart data={days} labels={{ table: t("chartTable"), hide: t("chartHide"), date: t("date"), count: t("count") }} />
        </section>
        <section className="rounded-card border border-line bg-bg-elevated/60 p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">{t("latest")}</h2>
            <Link href="/admin/leads" className="text-sm text-glow hover:underline">
              {t("viewAll")}
            </Link>
          </div>
          {(latest.data ?? []).length === 0 ? (
            <p className="py-10 text-center text-muted">{t("empty")}</p>
          ) : (
            <ul className="divide-y divide-line">
              {((latest.data ?? []) as { id: string; name: string; phone: string; status: string; created_at: string }[]).map((l) => (
                <li key={l.id}>
                  <Link href={`/admin/leads?id=${l.id}`} className="flex items-center justify-between gap-3 py-3 hover:text-glow">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{l.name}</p>
                      <p className="text-xs text-muted" dir="ltr">
                        {l.phone}
                      </p>
                    </div>
                    <StatusBadge status={l.status} label={tl(`statuses.${l.status}` as "statuses.new")} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
