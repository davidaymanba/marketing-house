"use client";

import { DirectionProvider } from "@radix-ui/react-direction";
import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { PreloaderProvider } from "./PreloaderProvider";
import { SmoothScroll } from "./SmoothScroll";
import { TransitionProvider } from "./TransitionProvider";

export function Providers({ children, dir }: { children: ReactNode; dir: "rtl" | "ltr" }) {
  return (
    <DirectionProvider dir={dir}>
      <MotionConfig reducedMotion="user">
        <PreloaderProvider>
          <SmoothScroll>
            <TransitionProvider>{children}</TransitionProvider>
          </SmoothScroll>
        </PreloaderProvider>
        <Toaster
          dir={dir}
          position={dir === "rtl" ? "bottom-left" : "bottom-right"}
          theme="dark"
          toastOptions={{
            classNames: {
              toast: "!glass !rounded-[20px] !text-fg !font-sans",
              description: "!text-muted",
            },
          }}
        />
      </MotionConfig>
    </DirectionProvider>
  );
}
