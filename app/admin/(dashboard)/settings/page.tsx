import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "الإعدادات" };

export default async function SettingsPage() {
  const { supabase } = await requireAdmin();
  const t = await getTranslations("admin.settings");
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  return (
    <>
      <PageHeader title={t("title")} />
      <SettingsForm initial={(data ?? {}) as Record<string, string | number>} />
    </>
  );
}
