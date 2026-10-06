"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Locks body scroll + closes on Escape while an overlay is open. */
function useOverlay(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
}

function Portal({ children }: { children: ReactNode }) {
  return typeof document === "undefined" ? null : createPortal(children, document.body);
}

/** Side drawer (slides in from the inline-start side in RTL). */
export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
  closeLabel,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  closeLabel: string;
  wide?: boolean;
}) {
  useOverlay(open, onClose);
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  return (
    <Portal>
      <AnimatePresence>
        {open ? (
          <div className="fixed inset-0 z-[60]" dir="rtl">
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
            <motion.div
              ref={panelRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-label={title}
              className={cn("absolute inset-y-0 end-0 flex w-full flex-col border-s border-line bg-bg-elevated outline-none", wide ? "max-w-3xl" : "max-w-xl")}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <header className="flex h-16 shrink-0 items-center justify-between border-b border-line px-6">
                <h2 className="text-lg font-bold">{title}</h2>
                <button type="button" onClick={onClose} aria-label={closeLabel} className="grid size-9 place-items-center rounded-lg text-muted hover:bg-surface hover:text-fg">
                  <X aria-hidden className="size-5" />
                </button>
              </header>
              <div className="flex-1 overflow-y-auto p-6">{children}</div>
              {footer ? <footer className="flex shrink-0 items-center justify-end gap-3 border-t border-line px-6 py-4">{footer}</footer> : null}
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </Portal>
  );
}

/** Confirmation dialog. */
export function ConfirmDialog({
  open,
  title,
  text,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  busy,
}: {
  open: boolean;
  title: string;
  text: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
}) {
  useOverlay(open, onCancel);
  return (
    <Portal>
      <AnimatePresence>
        {open ? (
          <div className="fixed inset-0 z-[70] grid place-items-center p-4" dir="rtl">
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCancel} />
            <motion.div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="confirm-title"
              className="relative w-full max-w-md rounded-card border border-line bg-bg-elevated p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
            >
              <h2 id="confirm-title" className="text-lg font-bold">
                {title}
              </h2>
              <p className="mt-2 text-muted">{text}</p>
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="ghost" size="sm" onClick={onCancel} autoFocus>
                  {cancelLabel}
                </Button>
                <Button size="sm" onClick={onConfirm} disabled={busy} className="!bg-none bg-red-500 hover:bg-red-600">
                  {confirmLabel}
                </Button>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </Portal>
  );
}

export function Switch({ checked, onChange, label, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 disabled:opacity-50", checked ? "bg-primary" : "bg-surface")}
    >
      <span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow transition-[inset-inline-start] duration-200", checked ? "start-[22px]" : "start-0.5")} />
    </button>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-surface/70", className)} />;
}

export function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
      {children ? <div className="flex flex-wrap items-center gap-3">{children}</div> : null}
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  new: "bg-glow/15 text-glow border-glow/30",
  contacted: "bg-sky-400/10 text-sky-300 border-sky-400/30",
  qualified: "bg-amber-400/10 text-amber-200 border-amber-400/30",
  won: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
  lost: "bg-red-400/10 text-red-300 border-red-400/30",
};

/** Status chip — always text + color, never color alone. */
export function StatusBadge({ status, label }: { status: string; label: string }) {
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", STATUS_STYLES[status])}>{label}</span>;
}

export const inputClass =
  "h-11 w-full rounded-xl border border-line bg-surface/50 px-4 text-sm text-fg outline-none transition-[border-color,box-shadow] placeholder:text-muted/60 focus:border-primary-light focus:shadow-[0_0_0_3px_rgba(124,58,237,0.2)]";
