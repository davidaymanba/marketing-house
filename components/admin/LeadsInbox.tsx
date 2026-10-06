"use client";

import { Download, Mail, MessageCircle, Phone, Search, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";
import { addLeadNote, deleteLead, getLeadNotes, updateLeadStatus } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConfirmDialog, Sheet, Skeleton, StatusBadge, inputClass } from "./ui";

export type LeadRow = {
  id: string;
  name: string;
  phone: string;
  email: string;
  budget: string;
  message: string;
  status: string;
  source: string;
  createdAt: string;
  service: string;
  branch: string;
};

const STATUSES = ["new", "contacted", "qualified", "won", "lost"] as const;
type Note = { id: string; body: string; created_at: string };

const fmtDate = (d: string, locale: string) =>
  new Date(d).toLocaleString(locale === "ar" ? "ar-EG-u-nu-latn" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Cairo",
  });
const intlPhone = (p: string) => p.replace(/^0/, "20");

export function LeadsInbox({ rows, initialId }: { rows: LeadRow[]; initialId: string | null }) {
  const t = useTranslations("admin.leads");
  const tc = useTranslations("admin.crud");
  const router = useRouter();
  const locale = useLocale();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(initialId);
  const [, startTransition] = useTransition();

  const [optimisticRows, applyOptimistic] = useOptimistic(rows, (state, patch: { id: string; status?: string; remove?: boolean }) =>
    patch.remove ? state.filter((r) => r.id !== patch.id) : state.map((r) => (r.id === patch.id ? { ...r, status: patch.status ?? r.status } : r)),
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return optimisticRows.filter(
      (r) => (status === "all" || r.status === status) && (!needle || [r.name, r.phone, r.email].some((v) => v.toLowerCase().includes(needle))),
    );
  }, [optimisticRows, q, status]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: optimisticRows.length };
    for (const s of STATUSES) c[s] = optimisticRows.filter((r) => r.status === s).length;
    return c;
  }, [optimisticRows]);

  const open = optimisticRows.find((r) => r.id === openId) ?? null;

  const changeStatus = (id: string, next: string) =>
    startTransition(async () => {
      applyOptimistic({ id, status: next });
      const res = await updateLeadStatus(id, next);
      if (res.ok) toast.success(t("statusUpdated"));
      else toast.error(tc("error"));
      router.refresh();
    });

  const remove = (id: string) =>
    startTransition(async () => {
      applyOptimistic({ id, remove: true });
      setOpenId(null);
      const res = await deleteLead(id);
      if (res.ok) toast.success(t("deleted"));
      else toast.error(tc("error"));
      router.refresh();
    });

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-60 flex-1">
          <Search aria-hidden className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search")} aria-label={t("search")} className={cn(inputClass, "ps-10")} />
        </div>
        <a
          href={`/admin/leads/export?status=${status === "all" ? "" : status}&q=${encodeURIComponent(q)}`}
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-line px-4 text-sm font-semibold hover:bg-surface"
        >
          <Download aria-hidden className="size-4" />
          {t("export")}
        </a>
      </div>

      <div role="tablist" aria-label={t("status")} className="mb-5 flex flex-wrap gap-2">
        {(["all", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            role="tab"
            type="button"
            aria-selected={status === s}
            onClick={() => setStatus(s)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              status === s ? "border-transparent bg-primary text-white" : "border-line text-muted hover:text-fg",
            )}
          >
            {s === "all" ? t("all") : t(`statuses.${s}`)} <span className="opacity-70">({counts[s]})</span>
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-card border border-line bg-bg-elevated/60">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="text-muted">
            <tr className="border-b border-line">
              {[t("name"), t("phone"), t("service"), t("branch"), t("status"), t("date")].map((h) => (
                <th key={h} className="p-4 text-start font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-10 text-center text-muted">
                  {t("empty")}
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setOpenId(r.id)}
                  className={cn("cursor-pointer border-b border-line/60 transition-colors last:border-0 hover:bg-surface/40", r.status === "new" && "font-semibold")}
                >
                  <td className="p-4">
                    <button type="button" className="text-start hover:text-glow" onClick={() => setOpenId(r.id)}>
                      {r.name}
                    </button>
                  </td>
                  <td className="p-4">
                    <span dir="ltr">{r.phone}</span>
                  </td>
                  <td className="p-4 text-muted">{r.service || "—"}</td>
                  <td className="p-4 text-muted">{r.branch || "—"}</td>
                  <td className="p-4">
                    <StatusBadge status={r.status} label={t(`statuses.${r.status}` as "statuses.new")} />
                  </td>
                  <td className="whitespace-nowrap p-4 text-muted">{fmtDate(r.createdAt, locale)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <LeadDrawer lead={open} onClose={() => setOpenId(null)} onStatus={changeStatus} onDelete={remove} />
    </>
  );
}

function LeadDrawer({
  lead,
  onClose,
  onStatus,
  onDelete,
}: {
  lead: LeadRow | null;
  onClose: () => void;
  onStatus: (id: string, s: string) => void;
  onDelete: (id: string) => void;
}) {
  const t = useTranslations("admin.leads");
  const tc = useTranslations("admin.crud");
  const tb = useTranslations("contact.form.budgets");
  const locale = useLocale();
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    if (!lead) return;
    setNotes(null);
    getLeadNotes(lead.id).then((res) => setNotes(res.ok ? (res.data ?? []) : []));
  }, [lead?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const submitNote = async () => {
    if (!lead || !note.trim()) return;
    setSaving(true);
    const optimistic: Note = { id: `tmp-${Date.now()}`, body: note.trim(), created_at: new Date().toISOString() };
    setNotes((n) => [...(n ?? []), optimistic]);
    setNote("");
    const res = await addLeadNote(lead.id, optimistic.body);
    setSaving(false);
    if (res.ok && res.data) {
      setNotes((n) => (n ?? []).map((x) => (x.id === optimistic.id ? res.data! : x)));
      toast.success(t("noteAdded"));
    } else {
      setNotes((n) => (n ?? []).filter((x) => x.id !== optimistic.id));
      toast.error(tc("error"));
    }
  };

  const rows = lead
    ? [
        { label: t("phone"), value: lead.phone, ltr: true },
        { label: t("email"), value: lead.email, ltr: true },
        { label: t("service"), value: lead.service },
        { label: t("branch"), value: lead.branch },
        { label: t("budget"), value: lead.budget ? tb(lead.budget as "lt10k") : "" },
        { label: t("source"), value: lead.source, ltr: true },
        { label: t("date"), value: fmtDate(lead.createdAt, locale) },
      ]
    : [];

  return (
    <>
      <Sheet open={Boolean(lead)} onClose={onClose} title={lead?.name ?? t("details")} closeLabel={tc("close")}>
        {lead ? (
          <div className="space-y-8">
            <div className="flex flex-wrap gap-2">
              <a href={`https://wa.me/${intlPhone(lead.phone)}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#25D366] px-4 text-sm font-semibold text-white">
                <MessageCircle aria-hidden className="size-4" />
                {t("whatsapp")}
              </a>
              <a href={`tel:+${intlPhone(lead.phone)}`} className="inline-flex h-10 items-center gap-2 rounded-xl border border-line px-4 text-sm font-semibold hover:bg-surface">
                <Phone aria-hidden className="size-4" />
                {t("call")}
              </a>
              {lead.email ? (
                <a href={`mailto:${lead.email}`} className="inline-flex h-10 items-center gap-2 rounded-xl border border-line px-4 text-sm font-semibold hover:bg-surface">
                  <Mail aria-hidden className="size-4" />
                  {t("email")}
                </a>
              ) : null}
            </div>

            <div>
              <label htmlFor="lead-status" className="mb-2 block text-sm text-muted">
                {t("status")}
              </label>
              <select id="lead-status" value={lead.status} onChange={(e) => onStatus(lead.id, e.target.value)} className={inputClass}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {t(`statuses.${s}`)}
                  </option>
                ))}
              </select>
            </div>

            <dl className="grid grid-cols-2 gap-4">
              {rows.map((r) => (
                <div key={r.label}>
                  <dt className="text-xs text-muted">{r.label}</dt>
                  <dd className="mt-1 break-words font-medium">{r.ltr && r.value ? <span dir="ltr">{r.value}</span> : r.value || "—"}</dd>
                </div>
              ))}
            </dl>

            <div>
              <p className="mb-2 text-xs text-muted">{t("message")}</p>
              <p className="whitespace-pre-wrap rounded-xl bg-surface/50 p-4 leading-relaxed">{lead.message}</p>
            </div>

            <div>
              <h3 className="mb-4 font-bold">{t("notes")}</h3>
              {notes === null ? (
                <div className="space-y-3">
                  <Skeleton className="h-14" />
                  <Skeleton className="h-14" />
                </div>
              ) : notes.length === 0 ? (
                <p className="text-sm text-muted">{t("noNotes")}</p>
              ) : (
                <ol className="relative space-y-4 border-s border-line ps-5">
                  {notes.map((n) => (
                    <li key={n.id} className="relative">
                      <span aria-hidden className="absolute -start-[25px] top-1.5 size-2.5 rounded-full bg-primary-light ring-4 ring-bg-elevated" />
                      <p className="text-xs text-muted">{fmtDate(n.created_at, locale)}</p>
                      <p className="mt-1 whitespace-pre-wrap">{n.body}</p>
                    </li>
                  ))}
                </ol>
              )}
              <div className="mt-4 flex gap-2">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={t("addNote")}
                  aria-label={t("addNote")}
                  rows={2}
                  className={cn(inputClass, "h-auto resize-none py-3")}
                />
                <Button type="button" size="sm" onClick={submitNote} disabled={saving || !note.trim()} className="self-end">
                  {t("save")}
                </Button>
              </div>
            </div>

            <button type="button" onClick={() => setConfirm(true)} className="inline-flex items-center gap-2 text-sm text-red-300 hover:text-red-200">
              <Trash2 aria-hidden className="size-4" />
              {t("delete")}
            </button>
          </div>
        ) : null}
      </Sheet>
      <ConfirmDialog
        open={confirm}
        title={tc("confirmDelete")}
        text={t("deleteConfirm")}
        confirmLabel={tc("delete")}
        cancelLabel={tc("cancel")}
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false);
          if (lead) onDelete(lead.id);
        }}
      />
    </>
  );
}
