"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Loader2, Send } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { submitLead } from "@/app/actions/lead";
import { Confetti } from "@/components/motion/Confetti";
import { Button } from "@/components/ui/button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { usePathname } from "@/i18n/navigation";
import { BUDGETS, leadSchema, leadSteps, type LeadInput } from "@/lib/validations/lead";
import { ease } from "@/lib/motion";

type Option = { value: string; label: string };

/** Glass form, 3 steps with per-step validation, animated success state. */
export function ContactForm({ services, branches }: { services: Option[]; branches: Option[] }) {
  const t = useTranslations("contact.form");
  const locale = useLocale();
  const pathname = usePathname();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [direction, setDirection] = useState(1);
  const startedAt = useRef(0);
  const honeypot = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    mode: "onTouched",
    defaultValues: { name: "", phone: "", email: "", serviceId: "", branchId: "", budget: "", message: "" },
  });

  const err = (key: keyof LeadInput) => {
    const code = errors[key]?.message;
    return code ? t(`errors.${code}` as "errors.name") : undefined;
  };

  const next = async () => {
    const ok = await trigger([...leadSteps[step]!] as (keyof LeadInput)[]);
    if (!ok) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, leadSteps.length - 1));
  };
  const back = () => {
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  const onSubmit = async (values: LeadInput) => {
    const res = await submitLead({
      ...values,
      website: honeypot.current?.value ?? "",
      startedAt: startedAt.current,
      locale,
      sourcePage: pathname,
    });
    if (res.ok) {
      setDone(true);
      reset();
      setStep(0);
      return;
    }
    if (res.error === "validation" && res.fields) {
      for (const [key, code] of Object.entries(res.fields)) setError(key as keyof LeadInput, { message: code });
      const first = leadSteps.findIndex((fields) => fields.some((f) => res.fields?.[f]));
      if (first >= 0) setStep(first);
      return;
    }
    toast.error(t(res.error === "rateLimit" ? "errors.rateLimit" : "errors.generic"));
  };

  const rtl = locale === "ar";
  const slide = (d: number) => (rtl ? -d : d) * 40;

  return (
    <div className="glass relative overflow-hidden rounded-card p-6 md:p-10">
      <div aria-hidden className="absolute -end-20 -top-20 size-60 rounded-full bg-primary/25 blur-[80px]" />
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: ease.expoOut }}
            className="relative flex min-h-[460px] flex-col items-center justify-center text-center"
            role="status"
          >
            <Confetti />
            <svg viewBox="0 0 96 96" className="size-24" aria-hidden>
              <motion.circle cx="48" cy="48" r="44" fill="none" stroke="url(#ok-grad)" strokeWidth="4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: ease.expoOut }} />
              <motion.path d="M30 50 L43 62 L67 36" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.5, ease: ease.expoOut }} />
              <defs>
                <linearGradient id="ok-grad" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0" stopColor="#4C1D95" />
                  <stop offset="0.5" stopColor="#7C3AED" />
                  <stop offset="1" stopColor="#C084FC" />
                </linearGradient>
              </defs>
            </svg>
            <h3 className="mt-8 text-h3">{t("successTitle")}</h3>
            <p className="mt-3 max-w-sm text-muted">{t("successText")}</p>
            <Button type="button" variant="ghost" className="mt-8" onClick={() => setDone(false)}>
              {t("again")}
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <div className="mb-8 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">{t("title")}</h2>
              <span className="text-sm text-muted">{t("step", { current: step + 1, total: leadSteps.length })}</span>
            </div>
            <div className="mb-8 grid grid-cols-3 gap-2" aria-hidden>
              {leadSteps.map((_, i) => (
                <span key={i} className="h-1 overflow-hidden rounded-full bg-surface">
                  <motion.span
                    className="bg-signature block h-full origin-left rtl:origin-right"
                    animate={{ scaleX: i <= step ? 1 : 0 }}
                    transition={{ duration: 0.6, ease: ease.expoOut }}
                  />
                </span>
              ))}
            </div>

            {/* Honeypot */}
            <div aria-hidden className="absolute -start-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="website">Website</label>
              <input ref={honeypot} id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="min-h-[300px]">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                  key={step}
                  custom={direction}
                  initial={{ opacity: 0, x: slide(direction) }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: slide(-direction) }}
                  transition={{ duration: 0.45, ease: ease.expoOut }}
                  className="grid gap-5"
                >
                  {step === 0 ? (
                    <>
                      <TextField id="name" label={t("name")} autoComplete="name" error={err("name")} {...register("name")} />
                      <TextField id="phone" label={t("phone")} type="tel" inputMode="tel" dir="ltr" autoComplete="tel" error={err("phone")} className="rtl:text-end" {...register("phone")} />
                      <TextField id="email" label={t("email")} type="email" dir="ltr" autoComplete="email" error={err("email")} className="rtl:text-end" {...register("email")} />
                    </>
                  ) : step === 1 ? (
                    <>
                      <SelectField id="serviceId" label={t("service")} placeholder={t("servicePlaceholder")} options={services} {...register("serviceId")} />
                      <SelectField id="branchId" label={t("branch")} placeholder={t("branchPlaceholder")} options={branches} {...register("branchId")} />
                      <SelectField
                        id="budget"
                        label={t("budget")}
                        placeholder={t("budgetPlaceholder")}
                        options={BUDGETS.map((b) => ({ value: b, label: t(`budgets.${b}`) }))}
                        {...register("budget")}
                      />
                    </>
                  ) : (
                    <TextAreaField id="message" label={t("message")} rows={8} error={err("message")} {...register("message")} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex items-center justify-between gap-4">
              {step > 0 ? (
                <Button type="button" variant="ghost" onClick={back}>
                  <ArrowLeft aria-hidden className="size-4 rtl:rotate-180" />
                  {t("back")}
                </Button>
              ) : (
                <span />
              )}
              {step < leadSteps.length - 1 ? (
                <Button type="button" onClick={next}>
                  {t("next")}
                  <ArrowRight aria-hidden className="size-4 rtl:rotate-180" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <Send aria-hidden className="size-4 rtl:-scale-x-100" />}
                  {isSubmitting ? t("sending") : t("submit")}
                </Button>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
