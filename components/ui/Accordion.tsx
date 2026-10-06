"use client";

import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

type Item = { q: string; a: string };

/** FAQ accordion. Height animates via grid-template-rows (0fr → 1fr), not `height`. */
export function Accordion({ items, className }: { items: Item[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();

  return (
    <div className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <h3>
              <button
                type="button"
                id={`${id}-h${i}`}
                aria-expanded={isOpen}
                aria-controls={`${id}-p${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-start text-lg font-semibold md:text-xl"
              >
                <span className={cn("transition-colors duration-300", isOpen ? "text-fg" : "text-fg/80 group-hover:text-fg")}>{item.q}</span>
                <span
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-full border border-line transition-[rotate,background-color,border-color] duration-500 ease-expo",
                    isOpen && "rotate-45 border-transparent bg-primary",
                  )}
                >
                  <Plus aria-hidden className="size-5" />
                </span>
              </button>
            </h3>
            <div
              id={`${id}-p${i}`}
              role="region"
              aria-labelledby={`${id}-h${i}`}
              className={cn("grid transition-[grid-template-rows,opacity] duration-500 ease-expo", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
            >
              <div className="overflow-hidden">
                <p className="max-w-3xl pb-6 text-muted">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
