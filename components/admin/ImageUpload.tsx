"use client";

import { ImagePlus, Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useRef, useState } from "react";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

const MAX_BYTES = 8 * 1024 * 1024;

/** Uploads to the public "media" bucket (RLS: admins only) and returns the public URL. */
export async function uploadImage(file: File, folder: string) {
  if (!file.type.startsWith("image/")) throw new Error("type");
  if (file.size > MAX_BYTES) throw new Error("size");
  const supabase = createSupabaseBrowserClient();
  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { cacheControl: "31536000", upsert: false });
  if (error) throw error;
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

/** Single image field with preview, replace and remove. */
export function ImageUpload({ value, onChange, folder, label }: { value: string; onChange: (url: string) => void; folder: string; label: string }) {
  const t = useTranslations("admin.crud");
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const onFile = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await uploadImage(file, folder));
    } catch {
      toast.error(t("uploadError"));
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div>
      <p className="mb-2 text-sm text-muted">{label}</p>
      <div className="flex items-center gap-4">
        <div className={cn("relative grid size-24 shrink-0 place-items-center overflow-hidden rounded-xl border border-dashed border-line bg-surface/40", value && "border-solid")}>
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="size-full object-cover" />
          ) : busy ? (
            <Loader2 aria-hidden className="size-5 animate-spin text-muted" />
          ) : (
            <ImagePlus aria-hidden className="size-6 text-muted" />
          )}
          {busy && value ? (
            <span className="absolute inset-0 grid place-items-center bg-black/50">
              <Loader2 aria-hidden className="size-5 animate-spin" />
            </span>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={id} className="inline-flex h-9 cursor-pointer items-center rounded-lg border border-line px-3 text-sm hover:bg-surface">
            {busy ? t("uploading") : value ? t("replace") : t("upload")}
          </label>
          <input ref={input} id={id} type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} disabled={busy} />
          {value ? (
            <button type="button" onClick={() => onChange("")} className="inline-flex items-center gap-1 text-sm text-red-300 hover:text-red-200">
              <X aria-hidden className="size-3.5" />
              {t("removeImage")}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Multiple images (project gallery). */
export function GalleryUpload({ value, onChange, folder, label }: { value: string[]; onChange: (urls: string[]) => void; folder: string; label: string }) {
  const t = useTranslations("admin.crud");
  const id = useId();
  const [busy, setBusy] = useState(false);

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      const urls = await Promise.all([...files].map((f) => uploadImage(f, folder)));
      onChange([...value, ...urls]);
    } catch {
      toast.error(t("uploadError"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <p className="mb-2 text-sm text-muted">{label}</p>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {value.map((url, i) => (
          <div key={url} className="group relative aspect-square overflow-hidden rounded-xl border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="size-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              aria-label={t("removeImage")}
              className="absolute end-1 top-1 grid size-7 place-items-center rounded-full bg-black/70 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
            >
              <X aria-hidden className="size-4" />
            </button>
          </div>
        ))}
        <label htmlFor={id} className="grid aspect-square cursor-pointer place-items-center rounded-xl border border-dashed border-line text-muted hover:bg-surface/50">
          {busy ? <Loader2 aria-hidden className="size-5 animate-spin" /> : <ImagePlus aria-hidden className="size-6" />}
          <span className="sr-only">{t("upload")}</span>
        </label>
        <input id={id} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => onFiles(e.target.files)} disabled={busy} />
      </div>
    </div>
  );
}
