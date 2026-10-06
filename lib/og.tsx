import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { LOGO_BARS } from "@/lib/brand";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fonts = Promise.all([
  readFile(join(process.cwd(), "assets/fonts/IBMPlexSansArabic-Bold.ttf")),
  readFile(join(process.cwd(), "assets/fonts/PlusJakartaSans-ExtraBold.ttf")),
]);

/**
 * Satori shapes Arabic glyphs but doesn't apply bidi word ordering, so RTL text
 * is rendered word-by-word in a reversed flex row.
 */
function Words({ text, rtl, style }: { text: string; rtl: boolean; style: Record<string, string | number> }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", flexDirection: rtl ? "row-reverse" : "row", columnGap: "0.28em", ...style }}>
      {text.split(/\s+/).filter(Boolean).map((w, i) => (
        <span key={i}>{w}</span>
      ))}
    </div>
  );
}

/** Branded OG image: dark violet canvas, glow, diagonal prisms, LogoMark, title. */
export async function renderOg({ title, eyebrow, locale }: { title: string; eyebrow: string; locale: string }) {
  const [arabic, latin] = await fonts;
  const rtl = locale === "ar";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0B0717 0%, #140C2B 60%, #2E1065 100%)",
          color: "#fff",
          fontFamily: rtl ? "Plex Arabic" : "Jakarta",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: -200, right: -100, width: 700, height: 700, borderRadius: 9999, background: "radial-gradient(circle, rgba(124,58,237,0.55), transparent 65%)", display: "flex" }} />
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              bottom: -40,
              ...(rtl ? { left: 60 + i * 120 } : { right: 60 + i * 120 }),
              width: 90,
              height: 380 + i * 60,
              background: "linear-gradient(0deg, rgba(76,29,149,0.1), rgba(168,85,247,0.45))",
              transform: "skewX(-38deg)",
              display: "flex",
            }}
          />
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexDirection: rtl ? "row-reverse" : "row" }}>
          <svg width="120" height="41" viewBox="0 0 842 285">
            <defs>
              <linearGradient id="g" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stopColor="#4C1D95" />
                <stop offset="0.5" stopColor="#7C3AED" />
                <stop offset="1" stopColor="#C084FC" />
              </linearGradient>
            </defs>
            {LOGO_BARS.map((d) => (
              <path key={d} d={d} fill="url(#g)" />
            ))}
          </svg>
          <div style={{ display: "flex", fontFamily: "Jakarta", fontSize: 26, letterSpacing: 8 }}>
            MARKETING <span style={{ color: "#A855F7", marginLeft: 12 }}>HOUSE</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: rtl ? "flex-end" : "flex-start", textAlign: rtl ? "right" : "left" }}>
          <Words text={eyebrow} rtl={rtl} style={{ fontSize: 28, color: "#C084FC", marginBottom: 18 }} />
          <Words text={title} rtl={rtl} style={{ fontSize: title.length > 28 ? 72 : 92, lineHeight: 1.15, maxWidth: 1000 }} />
        </div>
        <div style={{ display: "flex", height: 4, width: 220, background: "linear-gradient(90deg, #4C1D95, #7C3AED, #C084FC)", alignSelf: rtl ? "flex-end" : "flex-start" }} />
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Plex Arabic", data: arabic, weight: 700, style: "normal" },
        { name: "Jakarta", data: latin, weight: 800, style: "normal" },
      ],
    },
  );
}
