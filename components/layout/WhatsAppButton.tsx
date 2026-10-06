"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { WhatsappIcon } from "@/components/brand/SocialIcons";
import { ease } from "@/lib/motion";

/** Floating WhatsApp button with a pulsing ring. */
export function WhatsAppButton({ whatsapp }: { whatsapp: string }) {
  const t = useTranslations("whatsapp");

  return (
    <motion.a
      href={`https://wa.me/${whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("label")}
      data-cursor="call"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2.8, duration: 0.6, ease: ease.expoOut }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="group fixed bottom-5 end-5 z-[80] grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_40px_-8px_rgba(37,211,102,0.6)] md:bottom-8 md:end-8"
    >
      <span aria-hidden className="animate-pulse-ring absolute inset-0 rounded-full bg-[#25D366]" />
      <span aria-hidden className="animate-pulse-ring absolute inset-0 rounded-full bg-[#25D366] [animation-delay:1.1s]" />
      <WhatsappIcon className="relative size-7" />
      <span className="glass pointer-events-none absolute end-full me-3 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium opacity-0 transition-[opacity,translate] duration-300 group-hover:opacity-100 ltr:translate-x-2 rtl:-translate-x-2 group-hover:translate-x-0">
        {t("label")}
      </span>
    </motion.a>
  );
}
