import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Western digits in both locales (see CLAUDE.md §12). */
export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}
