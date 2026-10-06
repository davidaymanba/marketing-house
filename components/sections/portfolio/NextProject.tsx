"use client";

import { animate } from "motion/react";
import { useRef, useState, type MouseEvent } from "react";
import { BrandVisual } from "@/components/brand/BrandVisual";
import { scrollToTarget, useLenis } from "@/components/providers/SmoothScroll";
import { Link, useRouter } from "@/i18n/navigation";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { ease } from "@/lib/motion";

type Props = { href: string; label: string; title: string; seed: string; hue: number; cover: string | null };

/**
 * Big "Next project" link. On hover the cover reveals behind the title; on click
 * the cover expands to fill the screen, then the next project (whose fullscreen
 * cover is the same image) takes over — a seamless image-expand transition.
 */
export function NextProject({ href, label, title, seed, hue, cover }: Props) {
  const router = useRouter();
  const lenis = useLenis();
  const reduced = usePrefersReducedMotion();
  const imageRef = useRef<HTMLDivElement>(null);
  const [expanding, setExpanding] = useState(false);

  const onClick = async (e: MouseEvent<HTMLAnchorElement>) => {
    if (reduced || e.metaKey || e.ctrlKey || e.shiftKey || !imageRef.current) return;
    e.preventDefault();
    const el = imageRef.current;
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    setExpanding(true);
    lenis?.stop();
    el.style.position = "fixed";
    el.style.inset = "0";
    el.style.zIndex = "105";
    el.style.opacity = "1";
    await animate(
      el,
      {
        clipPath: [
          `inset(${r.top}px ${vw - r.right}px ${vh - r.bottom}px ${r.left}px round 20px)`,
          "inset(0px 0px 0px 0px round 0px)",
        ],
      },
      { duration: 0.9, ease: ease.smooth },
    );
    router.push(href, { scroll: false });
    scrollToTarget(lenis, 0, true);
    lenis?.start();
  };

  return (
    <section className="container-site py-20 md:py-28">
      <Link
        href={href}
        onClick={onClick}
        data-cursor="view"
        className="group relative block overflow-hidden rounded-[28px] border border-line px-6 py-20 text-center md:py-32"
      >
        <div
          ref={imageRef}
          aria-hidden
          className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-expo group-hover:opacity-60"
          style={{ clipPath: expanding ? undefined : "inset(0 round 28px)" }}
        >
          <BrandVisual src={cover} alt="" seed={seed} hue={hue} className="size-full scale-110 transition-transform duration-[1.4s] ease-expo group-hover:scale-100" sizes="100vw" />
        </div>
        <p className="eyebrow relative mb-6">{label}</p>
        <p className="relative text-[clamp(2.5rem,9vw,8rem)] font-extrabold leading-none transition-transform duration-700 ease-expo group-hover:scale-[1.03]">
          {title}
        </p>
      </Link>
    </section>
  );
}
