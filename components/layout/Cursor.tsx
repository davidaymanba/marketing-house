"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useRichPointerFx } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type CursorState = { hover: boolean; label: string | null; blend: boolean; hidden: boolean; down: boolean };

const INTERACTIVE = "a, button, [role='button'], [data-cursor], input[type='submit'], summary, label[for]";
const LABEL_KEYS = ["view", "drag", "call", "open"] as const;

/**
 * Desktop-only custom cursor: a glowing dot + a lagging ring that grows over
 * interactive elements and can show a label (data-cursor="view|drag|call|open").
 * Uses difference blending over images ([data-cursor-blend], img, video).
 */
export function Cursor() {
  const enabled = useRichPointerFx();
  if (!enabled) return null;
  return <CursorInner />;
}

function CursorInner() {
  const t = useTranslations("cursor");
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>({
    hover: false,
    label: null,
    blend: false,
    hidden: true,
    down: false,
  });

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("has-custom-cursor");
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      setState((s) => (s.hidden ? { ...s, hidden: false } : s));
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest) return;
      const interactive = target.closest(INTERACTIVE);
      const key = interactive?.getAttribute("data-cursor");
      const label =
        key && (LABEL_KEYS as readonly string[]).includes(key) ? t(key as (typeof LABEL_KEYS)[number]) : null;
      const blend = Boolean(target.closest("[data-cursor-blend], img, video"));
      setState((s) =>
        s.hover === Boolean(interactive) && s.label === label && s.blend === blend
          ? s
          : { ...s, hover: Boolean(interactive), label, blend },
      );
    };

    const onLeaveWindow = () => setState((s) => ({ ...s, hidden: true }));
    const onDown = () => setState((s) => ({ ...s, down: true }));
    const onUp = () => setState((s) => ({ ...s, down: false }));

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [t]);

  const { hover, label, blend, hidden, down } = state;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[120]">
      <div ref={ringRef} className={cn("fixed top-0", blend && !label && "mix-blend-difference")} style={{ left: 0 }}>
        <div
          className={cn(
            "grid place-items-center rounded-full border transition-[scale,opacity,background-color,border-color] duration-500 ease-expo",
            "size-10",
            hidden ? "opacity-0" : "opacity-100",
            label
              ? "scale-[2.4] border-transparent bg-signature"
              : hover
                ? "scale-[1.6] border-glow/70 bg-glow/10"
                : "scale-100 border-glow/40",
            blend && !label && "border-white bg-white",
            down && "scale-90",
          )}
        >
          <span
            className={cn(
              "text-[0.32rem] font-bold uppercase tracking-[0.2em] text-white transition-opacity duration-300 rtl:tracking-normal",
              label ? "opacity-100" : "opacity-0",
            )}
          >
            {label}
          </span>
        </div>
      </div>
      <div
        ref={dotRef}
        className={cn(
          "fixed top-0 size-1.5 rounded-full bg-glow shadow-[0_0_12px_2px_rgba(192,132,252,0.8)] transition-opacity duration-300",
          hidden || label ? "opacity-0" : "opacity-100",
        )}
        style={{ left: 0 }}
      />
    </div>
  );
}
