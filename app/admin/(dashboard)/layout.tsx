import type { ReactNode } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { requireAdmin } from "@/lib/admin/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { supabase, user } = await requireAdmin();
  const { count } = await supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new");

  return (
    <div className="flex min-h-svh">
      <Sidebar newLeads={count ?? 0} email={user.email ?? ""} />
      <main className="min-w-0 flex-1 px-4 pb-16 pt-20 md:px-8 lg:pt-10">{children}</main>
    </div>
  );
}
