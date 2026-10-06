"use client";

import { useLocale } from "next-intl";
import { useState } from "react";

type Point = { date: string; count: number };

/**
 * Leads per day (single series → no legend; the title names it).
 * Thin bars with 4px rounded tops anchored to the baseline, 2px gaps,
 * recessive grid, per-bar hover tooltip with a larger hit target, and a table view.
 */
export function LeadsChart({ data, labels }: { data: Point[]; labels: { table: string; hide: string; date: string; count: number | string } }) {
  const locale = useLocale();
  const [hover, setHover] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);
  const max = Math.max(4, ...data.map((d) => d.count));
  const ticks = [0, Math.ceil(max / 2), max];
  const W = 720;
  const H = 220;
  const pad = { t: 12, r: 8, b: 26, l: 30 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const step = iw / data.length;
  const bw = Math.max(4, step - 2);
  // d is a YYYY-MM-DD Cairo day; format it at noon UTC so no timezone can shift it.
  const fmt = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString(locale === "ar" ? "ar-EG-u-nu-latn" : "en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

  return (
    <div>
      <div className="relative" dir="ltr">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={String(labels.count)}>
          {ticks.map((t) => {
            const y = pad.t + ih - (t / max) * ih;
            return (
              <g key={t}>
                <line x1={pad.l} x2={W - pad.r} y1={y} y2={y} stroke="rgba(184,176,208,0.12)" strokeDasharray={t ? "3 4" : undefined} />
                <text x={pad.l - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#B8B0D0">
                  {t}
                </text>
              </g>
            );
          })}
          {data.map((d, i) => {
            const h = (d.count / max) * ih;
            const x = pad.l + i * step + (step - bw) / 2;
            const y = pad.t + ih - h;
            const r = Math.min(4, bw / 2, h);
            return (
              <g key={d.date}>
                {h > 0 ? (
                  <path
                    d={`M${x} ${pad.t + ih} V${y + r} Q${x} ${y} ${x + r} ${y} H${x + bw - r} Q${x + bw} ${y} ${x + bw} ${y + r} V${pad.t + ih} Z`}
                    fill="#A855F7"
                    opacity={hover === null || hover === i ? 1 : 0.45}
                  />
                ) : null}
                <rect
                  x={pad.l + i * step}
                  y={pad.t}
                  width={step}
                  height={ih}
                  fill="transparent"
                  onPointerEnter={() => setHover(i)}
                  onPointerLeave={() => setHover(null)}
                />
                {i % 5 === 0 ? (
                  <text x={x + bw / 2} y={H - 8} textAnchor="middle" fontSize="10" fill="#B8B0D0">
                    {fmt(d.date)}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
        {hover !== null && data[hover] ? (
          <div
            className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-lg border border-line bg-bg px-3 py-2 text-xs shadow-lg"
            style={{ left: `${((pad.l + hover * step + step / 2) / W) * 100}%` }}
            dir={locale === "ar" ? "rtl" : "ltr"}
          >
            <p className="text-muted">{fmt(data[hover].date)}</p>
            <p className="font-bold text-fg">
              {data[hover].count} <span className="font-normal text-muted">{labels.count}</span>
            </p>
          </div>
        ) : null}
      </div>
      <button type="button" onClick={() => setShowTable((v) => !v)} className="mt-3 text-xs text-muted underline-offset-4 hover:text-fg hover:underline">
        {showTable ? labels.hide : labels.table}
      </button>
      {showTable ? (
        <div className="mt-3 max-h-60 overflow-auto rounded-xl border border-line">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-bg-elevated text-muted">
              <tr>
                <th className="p-2 text-start font-medium">{labels.date}</th>
                <th className="p-2 text-start font-medium">{labels.count}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.date} className="border-t border-line">
                  <td className="p-2">{fmt(d.date)}</td>
                  <td className="p-2">{d.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
