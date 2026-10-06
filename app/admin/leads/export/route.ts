import { NextResponse, type NextRequest } from "next/server";
import { assertAdmin } from "@/lib/admin/auth";
import { adminPick, getAdminLocale } from "@/lib/admin/locale";

const STATUSES = ["new", "contacted", "qualified", "won", "lost"];

/** CSV export of leads (admin only). Honors ?status= and ?q= filters. */
export async function GET(request: NextRequest) {
  let supabase;
  try {
    ({ supabase } = await assertAdmin());
  } catch {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const locale = await getAdminLocale();
  const status = request.nextUrl.searchParams.get("status") ?? "";
  const q = (request.nextUrl.searchParams.get("q") ?? "").trim().toLowerCase();

  let query = supabase
    .from("leads")
    .select("created_at, name, phone, email, status, budget, message, source_page, services(title_ar, title_en), branches(name_ar, name_en)")
    .order("created_at", { ascending: false })
    .limit(10000);
  if (STATUSES.includes(status)) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) return new NextResponse(error.message, { status: 500 });

  const rows = ((data ?? []) as Record<string, unknown>[]).filter(
    (r) => !q || [r.name, r.phone, r.email].some((v) => String(v ?? "").toLowerCase().includes(q)),
  );
  // Neutralise spreadsheet formula injection and escape quotes.
  const cell = (v: unknown) => {
    let s = String(v ?? "");
    if (/^[=+\-@]/.test(s)) s = `'${s}`;
    return `"${s.replace(/"/g, '""')}"`;
  };
  const header = ["Date", "Name", "Phone", "Email", "Status", "Service", "Branch", "Budget", "Message", "Source"];
  const lines = rows.map((r) =>
    [
      r.created_at,
      r.name,
      r.phone,
      r.email,
      r.status,
      r.services ? adminPick(locale, (r.services as Record<string, string>).title_ar, (r.services as Record<string, string>).title_en) : "",
      r.branches ? adminPick(locale, (r.branches as Record<string, string>).name_ar, (r.branches as Record<string, string>).name_en) : "",
      r.budget,
      r.message,
      r.source_page,
    ]
      .map(cell)
      .join(","),
  );
  const csv = "﻿" + [header.map(cell).join(","), ...lines].join("\r\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
