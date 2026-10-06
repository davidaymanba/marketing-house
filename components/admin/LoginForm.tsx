"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/Field";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function LoginForm({ disabled }: { disabled?: boolean }) {
  const t = useTranslations("admin.login");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true);
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });
    if (error) {
      setError(t("invalid"));
      setLoading(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-5" noValidate>
      <TextField id="email" name="email" type="email" dir="ltr" autoComplete="email" required label={t("email")} disabled={disabled} />
      <TextField id="password" name="password" type="password" dir="ltr" autoComplete="current-password" required label={t("password")} disabled={disabled} />
      {error ? (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      ) : null}
      <Button type="submit" size="lg" disabled={disabled || loading} className="mt-2 w-full">
        {loading ? <Loader2 aria-hidden className="size-4 animate-spin" /> : null}
        {loading ? t("loading") : t("submit")}
      </Button>
    </form>
  );
}
