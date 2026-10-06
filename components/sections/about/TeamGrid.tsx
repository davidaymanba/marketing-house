import { BrandVisual } from "@/components/brand/BrandVisual";
import { FacebookIcon, InstagramIcon, LinkedinIcon } from "@/components/brand/SocialIcons";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { pick, type TeamMember } from "@/lib/content/types";

const ICONS = { linkedin: LinkedinIcon, instagram: InstagramIcon, facebook: FacebookIcon } as const;

/** Team grid: grayscale → colour on hover, socials slide in. */
export function TeamGrid({ team, locale, placeholderLabel }: { team: TeamMember[]; locale: string; placeholderLabel: string }) {
  return (
    <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {team.map((m) => (
        <StaggerItem key={m.id} className="group">
          <div className="relative aspect-[3/4] overflow-hidden rounded-card border border-line">
            <BrandVisual
              src={m.photo}
              alt={pick(m.name, locale)}
              seed={m.id}
              hue={270}
              variant="portrait"
              className="size-full grayscale transition-[filter,scale] duration-700 ease-expo group-hover:scale-105 group-hover:grayscale-0"
              sizes="(min-width: 1024px) 25vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent" />
            {m.isPlaceholder ? <span className="glass absolute start-3 top-3 rounded-full px-3 py-1 text-xs text-muted">{placeholderLabel}</span> : null}
            <ul className="absolute bottom-4 end-4 flex flex-col gap-2">
              {(Object.keys(ICONS) as (keyof typeof ICONS)[])
                .filter((k) => m.socials[k])
                .map((k, i) => {
                  const Icon = ICONS[k];
                  return (
                    <li
                      key={k}
                      className="translate-x-6 opacity-0 transition-[translate,opacity] duration-500 ease-expo group-hover:translate-x-0 group-hover:opacity-100 rtl:-translate-x-6"
                      style={{ transitionDelay: `${i * 60}ms` }}
                    >
                      <a href={m.socials[k]} target="_blank" rel="noopener noreferrer" aria-label={`${pick(m.name, locale)} — ${k}`} className="glass grid size-10 place-items-center rounded-full hover:bg-primary">
                        <Icon className="size-4" />
                      </a>
                    </li>
                  );
                })}
            </ul>
          </div>
          <h3 className="mt-4 text-lg font-bold">{pick(m.name, locale)}</h3>
          <p className="text-sm text-muted">{pick(m.role, locale)}</p>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
