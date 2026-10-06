"use client";

import { ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { Magnetic, MagneticInner } from "@/components/motion/Magnetic";
import { scrollToTarget, useLenis } from "@/components/providers/SmoothScroll";

export function BackToTop() {
  const t = useTranslations("footer");
  const lenis = useLenis();

  return (
    <Magnetic strength={0.4}>
      <button
        type="button"
        onClick={() => scrollToTarget(lenis, 0)}
        className="gradient-border group glass flex items-center gap-3 rounded-full py-2 ps-5 pe-2 text-sm font-medium"
      >
        <MagneticInner className="gap-3">
          {t("backToTop")}
          <span className="bg-signature grid size-9 place-items-center overflow-hidden rounded-full">
            <ArrowUp aria-hidden className="size-4 transition-transform duration-500 ease-expo group-hover:-translate-y-0.5" />
          </span>
        </MagneticInner>
      </button>
    </Magnetic>
  );
}
