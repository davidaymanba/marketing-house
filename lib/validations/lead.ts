import { z } from "zod";

/** Normalises Egyptian mobile numbers to 01XXXXXXXXX. */
export function normalizePhone(raw: string) {
  const digits = raw.replace(/[^\d+]/g, "").replace(/^\+?20/, "0");
  return digits.startsWith("1") ? `0${digits}` : digits;
}

export const EG_PHONE = /^01[0125]\d{8}$/;

export const BUDGETS = ["lt10k", "10to30k", "30to100k", "gt100k"] as const;

/** Error messages are i18n keys under contact.form.errors.* */
export const leadSchema = z.object({
  name: z.string().trim().min(2, "name").max(120, "name"),
  phone: z
    .string()
    .trim()
    .transform(normalizePhone)
    .refine((v) => EG_PHONE.test(v), "phone"),
  email: z.union([z.literal(""), z.email("email").max(200)]).optional().default(""),
  serviceId: z.string().max(100).optional().default(""),
  branchId: z.string().max(100).optional().default(""),
  budget: z.union([z.literal(""), z.enum(BUDGETS)]).optional().default(""),
  message: z.string().trim().min(10, "message").max(4000, "message"),
});

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;

/** Fields validated per form step. */
export const leadSteps = [["name", "phone", "email"], ["serviceId", "branchId", "budget"], ["message"]] as const;
