import { FileBadge, ShieldCheck } from "lucide-react";
import { ShineBadge } from "@/components/motion/ShineBadge";

type Props = {
  eyebrow: string;
  title: string;
  text: string;
  commercial: string;
  tax: string;
};

export function TrustStrip({ eyebrow, title, text, commercial, tax }: Props) {
  const badges = [
    { Icon: ShieldCheck, label: commercial },
    { Icon: FileBadge, label: tax },
  ];
  return (
    <section className="container-site relative py-12 md:py-16">
      <div className="relative overflow-hidden rounded-card border border-line bg-bg-elevated/50 p-8 md:p-12">
        <div aria-hidden className="diagonal-lines absolute inset-0 opacity-30" />
        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-4">{eyebrow}</p>
            <h2 className="text-h3">{title}</h2>
            <p className="mt-3 max-w-lg text-muted">{text}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {badges.map(({ Icon, label }, i) => (
              <ShineBadge key={label} delay={i * 1.2} className="flex items-center gap-4 p-5">
                <span className="bg-signature grid size-12 shrink-0 place-items-center rounded-xl">
                  <Icon aria-hidden className="size-6" strokeWidth={1.6} />
                </span>
                <span className="font-semibold">{label}</span>
              </ShineBadge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
