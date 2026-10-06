"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Mail, Phone } from "lucide-react";
import { useState, type ComponentType } from "react";
import { WhatsappIcon } from "@/components/brand/SocialIcons";
import { SpotlightCard } from "@/components/motion/SpotlightCard";
import { ease } from "@/lib/motion";

type Card = { key: string; label: string; value: string; href: string; copy: string; Icon: ComponentType<{ className?: string }>; cursor?: string };

/** Contact cards with copy-to-clipboard micro-interaction (icon morph + label). */
export function ContactCards({
  phone,
  whatsapp,
  email,
  labels,
}: {
  phone: string;
  whatsapp: string;
  email: string;
  labels: { phone: string; whatsapp: string; email: string; copy: string; copied: string };
}) {
  const [copied, setCopied] = useState<string | null>(null);
  const cards: Card[] = [
    { key: "phone", label: labels.phone, value: phone, href: `tel:+2${phone}`, copy: phone, Icon: Phone, cursor: "call" },
    { key: "whatsapp", label: labels.whatsapp, value: `+${whatsapp}`, href: `https://wa.me/${whatsapp}`, copy: `+${whatsapp}`, Icon: WhatsappIcon, cursor: "call" },
    { key: "email", label: labels.email, value: email, href: `mailto:${email}`, copy: email, Icon: Mail },
  ];

  const doCopy = async (card: Card) => {
    try {
      await navigator.clipboard.writeText(card.copy);
      setCopied(card.key);
      window.setTimeout(() => setCopied((c) => (c === card.key ? null : c)), 1800);
    } catch {}
  };

  return (
    <ul className="grid gap-4">
      {cards.map((card) => (
        <li key={card.key}>
          <SpotlightCard className="flex items-center gap-4 p-5">
            <span className="bg-signature grid size-12 shrink-0 place-items-center rounded-xl">
              <card.Icon className="size-5" />
            </span>
            <a href={card.href} target={card.key === "whatsapp" ? "_blank" : undefined} rel="noopener noreferrer" data-cursor={card.cursor} className="min-w-0 flex-1">
              <span className="block text-sm text-muted">{card.label}</span>
              <span dir="ltr" className="link-underline block truncate text-lg font-semibold rtl:text-end">
                {card.value}
              </span>
            </a>
            <button
              type="button"
              onClick={() => doCopy(card)}
              aria-label={`${labels.copy} ${card.label}`}
              className="relative grid size-11 shrink-0 place-items-center rounded-full border border-line transition-colors hover:bg-surface"
            >
              <AnimatePresence mode="wait" initial={false}>
                {copied === card.key ? (
                  <motion.span key="ok" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ duration: 0.3, ease: ease.expoOut }}>
                    <Check aria-hidden className="size-4 text-green-300" />
                  </motion.span>
                ) : (
                  <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0, rotate: 90 }} transition={{ duration: 0.3, ease: ease.expoOut }}>
                    <Copy aria-hidden className="size-4" />
                  </motion.span>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {copied === card.key ? (
                  <motion.span
                    role="status"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: -2 }}
                    exit={{ opacity: 0 }}
                    className="bg-signature absolute -top-9 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold"
                  >
                    {labels.copied}
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </button>
          </SpotlightCard>
        </li>
      ))}
    </ul>
  );
}
