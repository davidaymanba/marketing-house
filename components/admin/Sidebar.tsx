"use client";

import {
  Briefcase,
  Building2,
  ChevronsRight,
  ExternalLink,
  FolderTree,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Sparkles,
  Users,
  X,
  Gem,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "@/app/admin/actions";
import { LogoMark } from "@/components/brand/LogoMark";
import { cn } from "@/lib/utils";

const groups = [
  { key: null, items: [{ href: "/admin", key: "overview", Icon: LayoutDashboard }] },
  { key: "crm", items: [{ href: "/admin/leads", key: "leads", Icon: Inbox, badge: true }] },
  {
    key: "content",
    items: [
      { href: "/admin/services", key: "services", Icon: Sparkles },
      { href: "/admin/projects", key: "projects", Icon: Briefcase },
      { href: "/admin/project_categories", key: "categories", Icon: FolderTree },
      { href: "/admin/testimonials", key: "testimonials", Icon: MessageSquare },
      { href: "/admin/team_members", key: "team", Icon: Users },
      { href: "/admin/clients", key: "clients", Icon: Gem },
      { href: "/admin/branches", key: "branches", Icon: Building2 },
      { href: "/admin/settings", key: "settings", Icon: Settings },
    ],
  },
] as const;

/** Collapsible sidebar (desktop) / off-canvas drawer (mobile) with a new-lead badge. */
export function Sidebar({ newLeads, email }: { newLeads: number; email: string }) {
  const t = useTranslations("admin.nav");
  const tb = useTranslations("admin");
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem("mh-admin-collapsed") === "1");
    } catch {}
  }, []);
  useEffect(() => setMobileOpen(false), [pathname]);

  const toggle = () => {
    setCollapsed((c) => {
      try {
        localStorage.setItem("mh-admin-collapsed", c ? "0" : "1");
      } catch {}
      return !c;
    });
  };

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const nav = (compact: boolean) => (
    <div className="flex h-full flex-col">
      <div className={cn("flex h-20 items-center gap-3 px-5", compact && "justify-center px-0")}>
        <LogoMark className="w-9 shrink-0" />
        {!compact ? <span className="font-bold">{tb("brand")}</span> : null}
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
        {groups.map((group, gi) => (
          <div key={gi}>
            {group.key && !compact ? <p className="mb-2 px-3 text-xs font-semibold text-muted/70">{t(group.key)}</p> : null}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={compact ? t(item.key) : undefined}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors duration-200",
                        compact && "justify-center px-0",
                        active ? "text-white" : "text-muted hover:bg-surface/60 hover:text-fg",
                      )}
                    >
                      {active ? <motion.span layoutId={`nav-active-${compact}`} className="bg-signature absolute inset-0 rounded-xl" transition={{ type: "spring", stiffness: 400, damping: 34 }} /> : null}
                      <item.Icon aria-hidden className="relative size-[18px] shrink-0" />
                      {!compact ? <span className="relative">{t(item.key)}</span> : null}
                      {"badge" in item && item.badge && newLeads > 0 ? (
                        <span className={cn("relative grid min-w-5 place-items-center rounded-full bg-glow px-1.5 text-[11px] font-bold text-bg", compact ? "absolute -top-1 end-1" : "ms-auto")}>
                          {newLeads}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="space-y-1 border-t border-line p-3">
        <a href="/ar" target="_blank" rel="noopener noreferrer" className={cn("flex h-10 items-center gap-3 rounded-xl px-3 text-sm text-muted hover:bg-surface/60 hover:text-fg", compact && "justify-center px-0")}>
          <ExternalLink aria-hidden className="size-4" />
          {!compact ? t("viewSite") : null}
        </a>
        <form action={signOut}>
          <button type="submit" className={cn("flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm text-muted hover:bg-surface/60 hover:text-fg", compact && "justify-center px-0")} title={email}>
            <LogOut aria-hidden className="size-4 rtl:-scale-x-100" />
            {!compact ? t("signOut") : null}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className={cn("sticky top-0 hidden h-svh shrink-0 border-e border-line bg-bg-elevated/60 transition-[width] duration-300 ease-expo lg:block", collapsed ? "w-[76px]" : "w-64")}>
        {nav(collapsed)}
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? t("expand") : t("collapse")}
          className="absolute -end-3.5 top-24 grid size-7 place-items-center rounded-full border border-line bg-surface text-muted hover:text-fg"
        >
          <ChevronsRight aria-hidden className={cn("size-4 transition-transform", !collapsed && "rotate-180")} />
        </button>
      </aside>

      {/* Mobile */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-line bg-bg/90 px-4 backdrop-blur-xl lg:hidden">
        <LogoMark className="w-9" />
        <button type="button" onClick={() => setMobileOpen(true)} aria-label={t("openMenu")} className="grid size-10 place-items-center rounded-xl border border-line">
          <Menu aria-hidden className="size-5" />
          {newLeads > 0 ? <span className="absolute end-3 top-3 size-2.5 rounded-full bg-glow" /> : null}
        </button>
      </div>
      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.div className="fixed inset-0 z-50 bg-black/60 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} />
            <motion.aside
              className="fixed inset-y-0 start-0 z-50 w-72 border-e border-line bg-bg-elevated lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <button type="button" onClick={() => setMobileOpen(false)} aria-label={t("collapse")} className="absolute end-4 top-6 grid size-9 place-items-center rounded-lg border border-line">
                <X aria-hidden className="size-4" />
              </button>
              {nav(false)}
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
