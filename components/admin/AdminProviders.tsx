"use client";

import { DirectionProvider } from "@radix-ui/react-direction";
import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

export function AdminProviders({ children, dir }: { children: ReactNode; dir: "ltr" | "rtl" }) {
  return (
    <DirectionProvider dir={dir}>
      <MotionConfig reducedMotion="user" transition={{ duration: 0.25 }}>
        {children}
        <Toaster
          dir={dir}
          position={dir === "rtl" ? "bottom-left" : "bottom-right"}
          theme="dark"
          richColors
          toastOptions={{ classNames: { toast: "!rounded-2xl !font-sans" } }}
        />
      </MotionConfig>
    </DirectionProvider>
  );
}
