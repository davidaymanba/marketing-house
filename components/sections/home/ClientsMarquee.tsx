import Image from "next/image";
import { Marquee } from "@/components/motion/Marquee";
import type { Client } from "@/lib/content/types";

function ClientLogo({ client }: { client: Client }) {
  return (
    <div
      className="group mx-3 flex h-20 min-w-44 items-center justify-center rounded-card border border-line bg-bg-elevated/40 px-8 transition-[background-color,border-color] duration-500 hover:border-primary/50 hover:bg-surface/60 md:mx-4 md:h-24 md:min-w-56"
      title={client.isPlaceholder ? `${client.name} (placeholder)` : client.name}
    >
      {client.logo ? (
        <Image
          src={client.logo}
          alt={client.name}
          width={140}
          height={48}
          className="h-10 w-auto object-contain opacity-60 grayscale transition-[filter,opacity] duration-500 group-hover:opacity-100 group-hover:grayscale-0"
        />
      ) : (
        <span
          dir="ltr"
          className="font-display text-sm font-bold tracking-[0.3em] text-muted transition-colors duration-500 group-hover:text-glow md:text-base"
        >
          {client.name}
        </span>
      )}
    </div>
  );
}

export function ClientsMarquee({ title, clients }: { title: string; clients: Client[] }) {
  const half = Math.ceil(clients.length / 2);
  return (
    <section aria-label={title} className="relative py-16 md:py-24">
      <p className="eyebrow mb-10 text-center !text-muted">{title}</p>
      <div className="flex flex-col gap-4 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <Marquee speed={3}>
          {clients.slice(0, half).map((c) => (
            <ClientLogo key={c.id} client={c} />
          ))}
        </Marquee>
        <Marquee speed={3} reverse>
          {clients.slice(half).map((c) => (
            <ClientLogo key={c.id} client={c} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
