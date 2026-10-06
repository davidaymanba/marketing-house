import { Counter } from "@/components/motion/Counter";

type StatItem = { value: number; label: string; suffix?: string };

export function Stats({ eyebrow, items }: { eyebrow: string; items: StatItem[] }) {
  return (
    <section className="container-site relative py-24 md:py-32">
      <div className="mb-12 flex items-center gap-4">
        <span className="hairline w-12" />
        <p className="eyebrow">{eyebrow}</p>
      </div>
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line lg:grid-cols-5">
        {items.map((item, i) => (
          <div
            key={item.label}
            className="group relative flex flex-col-reverse justify-end overflow-hidden bg-bg p-6 transition-colors duration-500 hover:bg-bg-elevated md:p-10 max-lg:last:col-span-2"
          >
            {/* Diagonal accent */}
            <span aria-hidden className="absolute -end-6 -top-6 h-24 w-3 rotate-[38deg] bg-signature opacity-40 transition-transform duration-700 ease-expo group-hover:translate-y-4 rtl:-rotate-[38deg]" />
            <dt className="mt-3 text-sm text-muted md:text-base">{item.label}</dt>
            <dd className="text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold leading-none tracking-tight" dir="ltr">
              <Counter value={item.value} suffix={item.suffix ?? "+"} duration={2 + i * 0.2} className="text-gradient" />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
