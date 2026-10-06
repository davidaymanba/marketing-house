"use client";

import { Reorder, useDragControls } from "motion/react";
import { GripVertical, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteResource, reorderResource, saveResource, togglePublished } from "@/app/admin/actions";
import { ServiceIcon, serviceIconNames } from "@/components/brand/ServiceIcon";
import { Button } from "@/components/ui/button";
import { emptyValues, resources, type Field, type ResourceKey, type SubField } from "@/lib/admin/resources";
import type { ServiceIcon as IconName } from "@/lib/content/types";
import { cn } from "@/lib/utils";
import { GalleryUpload, ImageUpload } from "./ImageUpload";
import { ConfirmDialog, PageHeader, Sheet, Switch, inputClass } from "./ui";

type Row = Record<string, unknown> & { id: string };
type Option = { value: string; label: string };
type Options = { categories: Option[]; services: Option[] };

/** Generic, config-driven CRUD: list + drag-to-reorder + publish toggle + drawer editor. */
export function ResourceManager({ resourceKey, rows, options }: { resourceKey: ResourceKey; rows: Row[]; options: Options }) {
  const resource = resources[resourceKey];
  const t = useTranslations("admin.crud");
  const tr = useTranslations("admin.resources");
  const router = useRouter();
  const [items, setItems] = useState(rows);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const orderDirty = useRef(false);

  useEffect(() => setItems(rows), [rows]);

  const locale = useLocale();
  // In English, show the *_en column as the title (falling back to Arabic) and the other language below it.
  const localized = (r: Row, field: string) => {
    if (!field.endsWith("_ar")) return String(r[field] ?? "");
    const en = String(r[field.replace(/_ar$/, "_en")] ?? "");
    return locale === "en" ? en || String(r[field] ?? "") : String(r[field] ?? "") || en;
  };
  const title = (r: Row) => localized(r, resource.titleField);
  const subtitle = (r: Row) => (resource.subtitleField ? localized(r, resource.subtitleField) : "");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((r) => `${title(r)} ${subtitle(r)}`.toLowerCase().includes(q)) : items;
  }, [items, query]); // eslint-disable-line react-hooks/exhaustive-deps

  const persistOrder = () => {
    if (!orderDirty.current) return;
    orderDirty.current = false;
    const ids = items.map((i) => i.id);
    startTransition(async () => {
      const res = await reorderResource(resourceKey, ids);
      if (res.ok) toast.success(t("reordered"));
      else toast.error(t("error"));
    });
  };

  const toggle = (row: Row, value: boolean) => {
    setItems((list) => list.map((r) => (r.id === row.id ? { ...r, is_published: value } : r)));
    startTransition(async () => {
      const res = await togglePublished(resourceKey, row.id, value);
      if (!res.ok) {
        setItems((list) => list.map((r) => (r.id === row.id ? { ...r, is_published: !value } : r)));
        toast.error(t("error"));
      }
    });
  };

  const remove = (id: string) => {
    const prev = items;
    setItems((list) => list.filter((r) => r.id !== id));
    setConfirmId(null);
    startTransition(async () => {
      const res = await deleteResource(resourceKey, id);
      if (res.ok) toast.success(t("deletedOk"));
      else {
        setItems(prev);
        toast.error(t("error"));
      }
      router.refresh();
    });
  };

  return (
    <>
      <PageHeader title={tr(resourceKey)}>
        <span className="text-sm text-muted">
          {items.length} {t("items")}
        </span>
        <Button size="sm" onClick={() => setEditing("new")}>
          <Plus aria-hidden className="size-4" />
          {t("add")}
        </Button>
      </PageHeader>

      <div className="relative mb-4 max-w-sm">
        <Search aria-hidden className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("search")} aria-label={t("search")} className={cn(inputClass, "ps-10")} />
      </div>

      {items.length === 0 ? (
        <p className="rounded-card border border-dashed border-line p-12 text-center text-muted">{t("empty")}</p>
      ) : (
        <Reorder.Group
          axis="y"
          values={items}
          onReorder={(next) => {
            orderDirty.current = true;
            setItems(next);
          }}
          className="space-y-2"
        >
          {filtered.map((row) => (
            <ResourceItem
              key={row.id}
              row={row}
              title={title(row)}
              subtitle={subtitle(row)}
              image={resource.imageField ? String(row[resource.imageField] ?? "") : ""}
              draggable={!query}
              onDragEnd={persistOrder}
              onToggle={(v) => toggle(row, v)}
              onEdit={() => setEditing(row)}
              onDelete={() => setConfirmId(row.id)}
            />
          ))}
        </Reorder.Group>
      )}

      <Editor
        key={editing === "new" ? "new" : (editing?.id ?? "closed")}
        resourceKey={resourceKey}
        row={editing}
        options={options}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          router.refresh();
        }}
      />

      <ConfirmDialog
        open={Boolean(confirmId)}
        title={t("confirmDelete")}
        text={t("confirmDeleteText")}
        confirmLabel={t("delete")}
        cancelLabel={t("cancel")}
        onCancel={() => setConfirmId(null)}
        onConfirm={() => confirmId && remove(confirmId)}
      />
    </>
  );
}

function ResourceItem({
  row,
  title,
  subtitle,
  image,
  draggable,
  onDragEnd,
  onToggle,
  onEdit,
  onDelete,
}: {
  row: Row;
  title: string;
  subtitle: string;
  image: string;
  draggable: boolean;
  onDragEnd: () => void;
  onToggle: (v: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const t = useTranslations("admin.crud");
  const controls = useDragControls();
  const published = row.is_published !== false;

  return (
    <Reorder.Item
      value={row}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onDragEnd}
      className="flex items-center gap-3 rounded-2xl border border-line bg-bg-elevated/70 p-3 transition-colors hover:border-primary/40"
      whileDrag={{ scale: 1.01, boxShadow: "0 20px 40px -20px rgba(124,58,237,0.6)" }}
    >
      <button
        type="button"
        aria-label={t("dragToReorder")}
        disabled={!draggable}
        onPointerDown={(e) => draggable && controls.start(e)}
        className="grid size-9 shrink-0 cursor-grab touch-none place-items-center rounded-lg text-muted hover:bg-surface active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-30"
      >
        <GripVertical aria-hidden className="size-4" />
      </button>
      <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-surface">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="size-full object-cover" />
        ) : typeof row.icon === "string" ? (
          <ServiceIcon name={row.icon as IconName} className="size-5 text-glow" />
        ) : (
          <span className="bg-signature size-full opacity-60" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 truncate font-semibold">
          {title}
          {row.is_placeholder ? <span className="shrink-0 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 text-[11px] font-medium text-amber-200">{t("placeholder")}</span> : null}
        </p>
        {subtitle ? <p className="truncate text-sm text-muted">{subtitle}</p> : null}
      </div>
      <span className={cn("hidden text-xs sm:inline", published ? "text-emerald-300" : "text-muted")}>{published ? t("published") : t("draft")}</span>
      <Switch checked={published} onChange={onToggle} label={t("published")} />
      <button type="button" onClick={onEdit} aria-label={t("edit")} className="grid size-9 place-items-center rounded-lg text-muted hover:bg-surface hover:text-fg">
        <Pencil aria-hidden className="size-4" />
      </button>
      <button type="button" onClick={onDelete} aria-label={t("delete")} className="grid size-9 place-items-center rounded-lg text-muted hover:bg-red-500/10 hover:text-red-300">
        <Trash2 aria-hidden className="size-4" />
      </button>
    </Reorder.Item>
  );
}

/* --------------------------------- editor --------------------------------- */

function initialValues(resourceKey: ResourceKey, row: Row | "new" | null) {
  const resource = resources[resourceKey];
  if (!row || row === "new") return emptyValues(resource);
  const v: Record<string, unknown> = { is_published: row.is_published !== false };
  for (const f of resource.fields) {
    if (f.type === "bilingual") {
      v[`${f.name}_ar`] = row[`${f.name}_ar`] ?? "";
      v[`${f.name}_en`] = row[`${f.name}_en`] ?? "";
    } else if (f.type === "gallery") {
      const imgs = (row.project_images as { url: string; sort_order: number }[] | undefined) ?? [];
      v[f.name] = [...imgs].sort((a, b) => a.sort_order - b.sort_order).map((i) => i.url);
    } else v[f.name] = row[f.name] ?? (f.type === "list" || f.type === "multiselect" ? [] : f.type === "object" ? {} : f.type === "boolean" ? false : "");
  }
  return v;
}

function Editor({
  resourceKey,
  row,
  options,
  onClose,
  onSaved,
}: {
  resourceKey: ResourceKey;
  row: Row | "new" | null;
  options: Options;
  onClose: () => void;
  onSaved: () => void;
}) {
  const t = useTranslations("admin.crud");
  const tf = useTranslations("admin.fields");
  const locale = useLocale();
  const resource = resources[resourceKey];
  const [values, setValues] = useState<Record<string, unknown>>(() => initialValues(resourceKey, row));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const set = (name: string, value: unknown) => setValues((v) => ({ ...v, [name]: value }));
  const errText = (key: string) => (errors[key] ? t(errors[key] === "required" ? "required" : "invalid") + (errors[key] === "duplicate" ? " (slug)" : "") : undefined);

  const save = async () => {
    setSaving(true);
    setErrors({});
    const res = await saveResource(resourceKey, row && row !== "new" ? row.id : null, values);
    setSaving(false);
    if (res.ok) {
      toast.success(t("saved"));
      onSaved();
      return;
    }
    if (res.fields) setErrors(res.fields);
    toast.error(t("error"));
  };

  const renderField = (f: Field) => {
    const label = tf(f.label as "title");
    switch (f.type) {
      case "bilingual":
        return (
          <fieldset key={f.name} className="grid gap-3 sm:grid-cols-2">
            <legend className="mb-2 text-sm text-muted">{label}</legend>
            {(locale === "en" ? (["en", "ar"] as const) : (["ar", "en"] as const)).map((lang) => {
              const name = `${f.name}_${lang}`;
              const props = {
                id: name,
                value: String(values[name] ?? ""),
                onChange: (e: { target: { value: string } }) => set(name, e.target.value),
                dir: lang === "en" ? "ltr" : "rtl",
                placeholder: t(lang),
                "aria-label": `${label} — ${t(lang)}`,
                "aria-invalid": errors[name] ? true : undefined,
                className: cn(inputClass, f.textarea && "h-auto resize-y py-3"),
              } as const;
              return (
                <div key={lang}>
                  {f.textarea ? <textarea rows={3} {...props} /> : <input {...props} />}
                  {errText(name) ? <p className="mt-1 text-xs text-red-300">{errText(name)}</p> : null}
                </div>
              );
            })}
          </fieldset>
        );
      case "text":
      case "url":
      case "slug":
      case "textarea":
        return (
          <div key={f.name}>
            <label htmlFor={f.name} className="mb-2 block text-sm text-muted">
              {label}
              {f.type === "slug" ? <span className="ms-2 text-xs opacity-70">({tf("slugHint")})</span> : null}
            </label>
            {f.type === "textarea" ? (
              <textarea id={f.name} rows={3} value={String(values[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)} className={cn(inputClass, "h-auto py-3")} />
            ) : (
              <input
                id={f.name}
                type={f.type === "url" ? "url" : "text"}
                dir={f.dir ?? (f.type === "slug" ? "ltr" : undefined)}
                value={String(values[f.name] ?? "")}
                onChange={(e) => set(f.name, e.target.value)}
                aria-invalid={errors[f.name] ? true : undefined}
                className={inputClass}
              />
            )}
            {errText(f.name) ? <p className="mt-1 text-xs text-red-300">{errText(f.name)}</p> : null}
          </div>
        );
      case "number":
        return (
          <div key={f.name}>
            <label htmlFor={f.name} className="mb-2 block text-sm text-muted">
              {label}
            </label>
            <input id={f.name} type="number" dir="ltr" min={f.min} max={f.max} value={String(values[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)} className={inputClass} />
            {errText(f.name) ? <p className="mt-1 text-xs text-red-300">{errText(f.name)}</p> : null}
          </div>
        );
      case "boolean":
        return (
          <label key={f.name} className="flex items-center justify-between gap-4 rounded-xl border border-line px-4 py-3">
            <span className="text-sm">{label}</span>
            <Switch checked={Boolean(values[f.name])} onChange={(v) => set(f.name, v)} label={label} />
          </label>
        );
      case "image":
        return <ImageUpload key={f.name} label={label} folder={resource.table} value={String(values[f.name] ?? "")} onChange={(url) => set(f.name, url)} />;
      case "gallery":
        return <GalleryUpload key={f.name} label={label} folder={`${resource.table}/gallery`} value={(values[f.name] as string[]) ?? []} onChange={(urls) => set(f.name, urls)} />;
      case "select": {
        const opts = f.options === "icons" ? serviceIconNames.map((n) => ({ value: n, label: n })) : options.categories;
        return (
          <div key={f.name}>
            <label htmlFor={f.name} className="mb-2 block text-sm text-muted">
              {label}
            </label>
            <div className="flex items-center gap-3">
              {f.options === "icons" ? (
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface text-glow">
                  <ServiceIcon name={String(values[f.name] || "palette") as IconName} className="size-5" />
                </span>
              ) : null}
              <select id={f.name} value={String(values[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)} className={inputClass}>
                {f.options === "categories" ? <option value="">{t("none")}</option> : null}
                {opts.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      }
      case "multiselect": {
        const selected = (values[f.name] as string[]) ?? [];
        return (
          <fieldset key={f.name}>
            <legend className="mb-2 text-sm text-muted">{label}</legend>
            <div className="flex flex-wrap gap-2">
              {options.services.map((o) => {
                const on = selected.includes(o.value);
                return (
                  <button
                    key={o.value}
                    type="button"
                    aria-pressed={on}
                    onClick={() => set(f.name, on ? selected.filter((x) => x !== o.value) : [...selected, o.value])}
                    className={cn("rounded-full border px-3 py-1.5 text-sm transition-colors", on ? "border-transparent bg-primary text-white" : "border-line text-muted hover:text-fg")}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      }
      case "list":
        return <ListField key={f.name} label={label} itemFields={f.itemFields} value={(values[f.name] as Record<string, unknown>[]) ?? []} onChange={(v) => set(f.name, v)} />;
      case "object": {
        const obj = (values[f.name] as Record<string, string>) ?? {};
        return (
          <fieldset key={f.name} className="grid gap-3">
            <legend className="mb-2 text-sm text-muted">{label}</legend>
            {f.itemFields.map((sf) => (
              <input
                key={sf.name}
                dir={sf.dir}
                aria-label={tf(sf.label as "title")}
                placeholder={tf(sf.label as "title")}
                value={obj[sf.name] ?? ""}
                onChange={(e) => set(f.name, { ...obj, [sf.name]: e.target.value })}
                className={inputClass}
              />
            ))}
          </fieldset>
        );
      }
    }
  };

  return (
    <Sheet
      open={Boolean(row)}
      onClose={onClose}
      wide
      closeLabel={t("close")}
      title={row === "new" ? t("add") : t("edit")}
      footer={
        <>
          <label className="me-auto flex items-center gap-3 text-sm">
            <Switch checked={values.is_published !== false} onChange={(v) => set("is_published", v)} label={t("published")} />
            {values.is_published !== false ? t("published") : t("draft")}
          </label>
          <Button variant="ghost" size="sm" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button size="sm" onClick={save} disabled={saving}>
            {saving ? t("saving") : t("save")}
          </Button>
        </>
      }
    >
      <div className="grid gap-6">{resource.fields.map(renderField)}</div>
    </Sheet>
  );
}

/** Repeater for jsonb arrays (tags, deliverables, FAQs, results…). */
function ListField({
  label,
  itemFields,
  value,
  onChange,
}: {
  label: string;
  itemFields: SubField[];
  value: Record<string, unknown>[];
  onChange: (v: Record<string, unknown>[]) => void;
}) {
  const t = useTranslations("admin.crud");
  const tf = useTranslations("admin.fields");
  const blank = () => Object.fromEntries(itemFields.map((f) => [f.name, f.type === "number" ? 0 : ""]));
  const update = (i: number, name: string, v: unknown) => onChange(value.map((item, j) => (j === i ? { ...item, [name]: v } : item)));
  const subLabel = (sf: SubField) => {
    const base = ["ar", "en"].includes(sf.label) ? t(sf.label as "ar") : tf(sf.label as "title");
    const lang = sf.name.endsWith("_ar") ? ` (${t("ar")})` : sf.name.endsWith("_en") ? ` (${t("en")})` : "";
    return base + lang;
  };

  return (
    <fieldset>
      <legend className="mb-2 text-sm text-muted">{label}</legend>
      <div className="space-y-3">
        {value.map((item, i) => (
          <div key={i} className="relative grid gap-2 rounded-xl border border-line bg-surface/20 p-3 pe-12 sm:grid-cols-2">
            {itemFields.map((sf) =>
              sf.type === "textarea" ? (
                <textarea
                  key={sf.name}
                  rows={2}
                  dir={sf.dir}
                  aria-label={subLabel(sf)}
                  placeholder={subLabel(sf)}
                  value={String(item[sf.name] ?? "")}
                  onChange={(e) => update(i, sf.name, e.target.value)}
                  className={cn(inputClass, "h-auto py-2")}
                />
              ) : (
                <input
                  key={sf.name}
                  type={sf.type === "number" ? "number" : "text"}
                  step="any"
                  dir={sf.dir ?? (sf.type === "number" ? "ltr" : undefined)}
                  aria-label={subLabel(sf)}
                  placeholder={subLabel(sf)}
                  value={String(item[sf.name] ?? "")}
                  onChange={(e) => update(i, sf.name, sf.type === "number" ? e.target.value : e.target.value)}
                  className={inputClass}
                />
              ),
            )}
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              aria-label={t("removeItem")}
              className="absolute end-2 top-2 grid size-8 place-items-center rounded-lg text-muted hover:bg-red-500/10 hover:text-red-300"
            >
              <X aria-hidden className="size-4" />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...value, blank()])} className="inline-flex items-center gap-2 rounded-lg border border-dashed border-line px-3 py-2 text-sm text-muted hover:text-fg">
          <Plus aria-hidden className="size-4" />
          {t("addItem")}
        </button>
      </div>
    </fieldset>
  );
}
