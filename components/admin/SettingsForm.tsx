"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { saveSettings } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { inputClass } from "./ui";

type Def = { name: string; label: string; type?: "number" | "textarea"; dir?: "ltr" };

export function SettingsForm({ initial }: { initial: Record<string, string | number> }) {
  const t = useTranslations("admin.settings");
  const tc = useTranslations("admin.crud");
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string | number>>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const sections: { title: string; hint?: string; fields: Def[] }[] = [
    {
      title: t("contact"),
      fields: [
        { name: "phone", label: t("phone"), dir: "ltr" },
        { name: "whatsapp", label: t("whatsapp"), dir: "ltr" },
        { name: "email", label: t("email"), dir: "ltr" },
      ],
    },
    {
      title: t("socials"),
      fields: [
        { name: "facebook", label: "Facebook", dir: "ltr" },
        { name: "instagram", label: "Instagram", dir: "ltr" },
        { name: "linkedin", label: "LinkedIn", dir: "ltr" },
      ],
    },
    {
      title: t("legal"),
      hint: t("legalHint"),
      fields: [
        { name: "commercial_reg_no", label: t("commercialRegNo"), dir: "ltr" },
        { name: "tax_card_no", label: t("taxCardNo"), dir: "ltr" },
      ],
    },
    {
      title: t("stats"),
      fields: [
        { name: "stat_projects", label: t("statProjects"), type: "number" },
        { name: "stat_clients", label: t("statClients"), type: "number" },
        { name: "stat_years", label: t("statYears"), type: "number" },
        { name: "stat_campaigns", label: t("statCampaigns"), type: "number" },
      ],
    },
    {
      title: t("seo"),
      fields: [
        { name: "seo_title_ar", label: `${t("seoTitle")} (${tc("ar")})` },
        { name: "seo_title_en", label: `${t("seoTitle")} (${tc("en")})`, dir: "ltr" },
        { name: "seo_description_ar", label: `${t("seoDescription")} (${tc("ar")})`, type: "textarea" },
        { name: "seo_description_en", label: `${t("seoDescription")} (${tc("en")})`, type: "textarea", dir: "ltr" },
      ],
    },
  ];

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    const payload = Object.fromEntries(sections.flatMap((s) => s.fields.map((f) => [f.name, values[f.name] ?? (f.type === "number" ? 0 : "")])));
    const res = await saveSettings(payload);
    setSaving(false);
    if (res.ok) {
      toast.success(t("saved"));
      router.refresh();
    } else {
      if (res.fields) setErrors(res.fields);
      toast.error(tc("error"));
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid max-w-4xl gap-6">
      {sections.map((s) => (
        <section key={s.title} className="rounded-card border border-line bg-bg-elevated/60 p-6">
          <h2 className="font-bold">{s.title}</h2>
          {s.hint ? <p className="mt-1 text-sm text-muted">{s.hint}</p> : null}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {s.fields.map((f) => (
              <div key={f.name} className={cn(f.type === "textarea" && "sm:col-span-2")}>
                <label htmlFor={f.name} className="mb-2 block text-sm text-muted">
                  {f.label}
                </label>
                {f.type === "textarea" ? (
                  <textarea
                    id={f.name}
                    rows={3}
                    dir={f.dir}
                    value={String(values[f.name] ?? "")}
                    onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                    className={cn(inputClass, "h-auto py-3")}
                  />
                ) : (
                  <input
                    id={f.name}
                    type={f.type === "number" ? "number" : "text"}
                    min={f.type === "number" ? 0 : undefined}
                    dir={f.dir ?? (f.type === "number" ? "ltr" : undefined)}
                    value={String(values[f.name] ?? "")}
                    onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                    aria-invalid={errors[f.name] ? true : undefined}
                    className={inputClass}
                  />
                )}
                {errors[f.name] ? <p className="mt-1 text-xs text-red-300">{tc("invalid")}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ))}
      <div className="sticky bottom-4 flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving ? tc("saving") : tc("save")}
        </Button>
      </div>
    </form>
  );
}
