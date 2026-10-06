"use client";

import { DirectionProvider } from "@radix-ui/react-direction";
import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

export function AdminProviders({ children }: { children: ReactNode }) {
  return (
    <DirectionProvider dir="rtl">
      <MotionConfig reducedMotion="user" transition={{ duration: 0.25 }}>
        {children}
        <Toaster
          dir="rtl"
          position="bottom-left"
          theme="dark"
          richColors
          toastOptions={{ classNames: { toast: "!rounded-2xl !font-sans" } }}
        />
      </MotionConfig>
    </DirectionProvider>
  );
}
