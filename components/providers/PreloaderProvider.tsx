"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type PreloaderState = { done: boolean; finish: () => void };

const PreloaderContext = createContext<PreloaderState>({ done: true, finish: () => {} });

/**
 * `done` flips to true when the preloader starts its exit wipe (or immediately
 * when it is skipped for repeat visits / reduced motion). Hero intros wait on it.
 */
export const usePreloader = () => useContext(PreloaderContext);

export const PRELOADER_KEY = "mh-preloaded";

export function PreloaderProvider({ children }: { children: ReactNode }) {
  const [done, setDone] = useState(false);
  const finish = useCallback(() => setDone(true), []);

  return (
    <PreloaderContext.Provider value={{ done, finish }}>{children}</PreloaderContext.Provider>
  );
}

/**
 * Runs before first paint: hides the preloader on repeat visits and under
 * reduced motion, so it never flashes.
 */
export const preloaderGateScript = `try{if(sessionStorage.getItem("${PRELOADER_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("mh-no-preloader")}catch(e){document.documentElement.classList.add("mh-no-preloader")}`;
