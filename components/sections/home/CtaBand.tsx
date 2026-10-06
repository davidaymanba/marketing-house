import { Marquee } from "@/components/motion/Marquee";
import { RevealText } from "@/components/motion/RevealText";
import { MagneticButton } from "@/components/ui/MagneticButton";

/** Gradient band with animated diagonal stripes, a marquee behind a huge headline, and a magnetic CTA. */
export function CtaBand({ title, text, cta, marquee }: { title: string; text: string; cta: string; marquee: string }) {
  return (
    <section className="container-site py-16 md:py-24">
      <div className="bg-signature relative isolate overflow-hidden rounded-[28px] px-6 py-20 text-center md:px-12 md:py-32">
        {/* Animated diagonal stripes */}
        <div aria-hidden className="absolute -inset-x-12 inset-y-0 -z-10 opacity-25">
          <div className="animate-stripes absolute -start-12 inset-y-0 w-[calc(100%+96px)] bg-[repeating-linear-gradient(-52deg,transparent_0_20px,rgba(255,255,255,0.35)_20px_22px,transparent_22px_48px)] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        </div>
        {/* Marquee behind */}
        <div aria-hidden className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 opacity-15">
          <Marquee speed={2} pauseOnHover={false} itemClassName="pe-12">
            <span className="whitespace-nowrap px-6 text-[clamp(4rem,12vw,11rem)] font-extrabold leading-none">{marquee}</span>
          </Marquee>
        </div>
        <div aria-hidden className="absolute -bottom-1/2 start-1/2 -z-10 size-[60%] -translate-x-1/2 rounded-full bg-white/20 blur-[100px] rtl:translate-x-1/2" />

        <RevealText as="h2" split="words" className="mx-auto max-w-5xl text-[clamp(2.75rem,8vw,7.5rem)] font-extrabold leading-[1.05] rtl:leading-[1.3]">
          {title}
        </RevealText>
        <p className="mx-auto mt-6 max-w-xl text-lead text-white/85">{text}</p>
        <div className="mt-10 flex justify-center">
          <MagneticButton href="/contact" size="lg" variant="subtle" className="bg-white !text-primary-deep hover:bg-white">
            {cta}
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
