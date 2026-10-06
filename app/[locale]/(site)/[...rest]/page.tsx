import { notFound } from "next/navigation";

/** Catch-all so unknown localized paths render the branded not-found page. */
export default function CatchAll() {
  notFound();
}
