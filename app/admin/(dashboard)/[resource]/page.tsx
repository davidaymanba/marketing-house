import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { requireAdmin } from "@/lib/admin/auth";
import { isResourceKey, resources } from "@/lib/admin/resources";

type Props = { params: Promise<{ resource: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { resource } = await params;
  if (!isResourceKey(resource)) return {};
  const t = await getTranslations("admin.resources");
  return { title: t(resource) };
}

export default async function ResourcePage({ params }: Props) {
  const { resource: key } = await params;
  if (!isResourceKey(key)) notFound();
  const { supabase } = await requireAdmin();
  const resource = resources[key];

  const select = key === "projects" ? "*, project_images(url, sort_order)" : "*";
  const [{ data }, categories, services] = await Promise.all([
    supabase.from(resource.table).select(select).order("sort_order"),
    key === "projects" ? supabase.from("project_categories").select("id, name_ar").order("sort_order") : Promise.resolve({ data: [] }),
    key === "projects" ? supabase.from("services").select("slug, title_ar").order("sort_order") : Promise.resolve({ data: [] }),
  ]);

  return (
    <ResourceManager
      resourceKey={key}
      rows={(data ?? []) as unknown as (Record<string, unknown> & { id: string })[]}
      options={{
        categories: ((categories.data ?? []) as { id: string; name_ar: string }[]).map((c) => ({ value: c.id, label: c.name_ar })),
        services: ((services.data ?? []) as { slug: string; title_ar: string }[]).map((s) => ({ value: s.slug, label: s.title_ar })),
      }}
    />
  );
}
