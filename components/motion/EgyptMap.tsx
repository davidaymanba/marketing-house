import { cn } from "@/lib/utils";

const MAINLAND =
  "M8.7 12 L42.3 15.3 L45.8 12.8 L55.6 12.8 L59.1 14.5 L60.9 25.6 L61.2 33 L71.1 48.3 L72 53 L78.9 66.4 L82.2 82.8 L88.5 90.3 L91.3 92 L8 92 Z";
const SINAI = "M59.1 14.5 L72.4 14.5 L77.3 29.5 L73.1 42.8 L60.9 25.6 Z";
const NILE = "M50 14 Q52 20 53 25 Q51 37 52.5 49 Q58 54 61 58 Q64 65 63 71.5 Q60 82 56 92";

export type MapPin = { key: string; x: number; y: number; label: string };

/** Minimal stylized Egypt map with glowing, pulsing branch pins. */
export function EgyptMap({ pins, active, className }: { pins: MapPin[]; active?: string | null; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cn("overflow-visible", className)} style={{ direction: "ltr" }} aria-hidden>
      <defs>
        <linearGradient id="eg-fill" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#4C1D95" stopOpacity="0.18" />
          <stop offset="1" stopColor="#C084FC" stopOpacity="0.12" />
        </linearGradient>
        <pattern id="eg-lines" width="2.4" height="2.4" patternUnits="userSpaceOnUse" patternTransform="rotate(-38)">
          <line x1="0" y1="0" x2="0" y2="2.4" stroke="#A855F7" strokeOpacity="0.18" strokeWidth="0.25" />
        </pattern>
      </defs>
      <g stroke="#A855F7" strokeOpacity="0.55" strokeWidth="0.35" strokeLinejoin="round">
        <path d={MAINLAND} fill="url(#eg-fill)" />
        <path d={MAINLAND} fill="url(#eg-lines)" stroke="none" />
        <path d={SINAI} fill="url(#eg-fill)" />
      </g>
      <path d={NILE} fill="none" stroke="#C084FC" strokeOpacity="0.6" strokeWidth="0.6" strokeLinecap="round" />
      {pins.map((pin) => {
        const on = active === pin.key;
        return (
          <g key={pin.key} transform={`translate(${pin.x} ${pin.y})`}>
            <circle r="3.2" fill="#A855F7" opacity={on ? 0.5 : 0.25} className="origin-center animate-pulse-ring [transform-box:fill-box]" />
            <circle
              r={on ? 1.9 : 1.3}
              fill={on ? "#FFFFFF" : "#C084FC"}
              className="transition-all duration-500"
              style={{ filter: "drop-shadow(0 0 2px #C084FC)" }}
            />
            <text
              x={pin.x > 52 ? 3.5 : -3.5}
              y="1"
              textAnchor={pin.x > 52 ? "start" : "end"}
              fontSize="3.4"
              fontWeight="700"
              fill="#FFFFFF"
              opacity={on ? 1 : 0.55}
              className="transition-opacity duration-500"
            >
              {pin.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
