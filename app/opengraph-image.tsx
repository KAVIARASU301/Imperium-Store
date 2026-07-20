import { ImageResponse } from "next/og";

// Shared-link preview card. Mirrors the landing hero (dark canvas, cyan glow,
// typographic headline) instead of a product screenshot, so links unfurl as a
// branded hero rather than a raw image. See app/twitter-image.tsx for X cards.

export const alt = "Imperium Trader – the options terminal for Indian traders. Trade faster. Practice safer.";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

// Palette lifted from app/globals.css so the card stays in sync with the site.
const COLORS = {
  main: "#05080F",
  section: "#0B1626",
  brand: "#8BBCE8",
  brandGlow: "rgba(47,111,166,0.20)",
  white: "#FFFFFF",
  copy: "#E8EEF6",
  muted: "#A7B2C2",
  gold: "#F1D58A",
  border: "rgba(139,188,232,0.22)",
};

// Best-effort Space Grotesk load. If Google Fonts is unreachable at render/build
// time we fall back to Satori's built-in font rather than failing the build.
async function loadGrotesk(weight: 400 | 700): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@${weight}`,
      // No modern UA → Google returns a TTF url, which Satori can parse.
      { headers: { "User-Agent": "Mozilla/4.0" } },
    ).then((res) => res.text());

    const url = css.match(/src:\s*url\((.+?)\)\s*format\(['"]?(?:truetype|opentype)['"]?\)/)?.[1];
    if (!url) return null;

    return await fetch(url).then((res) => res.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function Image() {
  const [regular, bold] = await Promise.all([loadGrotesk(400), loadGrotesk(700)]);

  const fonts = [
    regular && { name: "Space Grotesk", data: regular, style: "normal" as const, weight: 400 as const },
    bold && { name: "Space Grotesk", data: bold, style: "normal" as const, weight: 700 as const },
  ].filter(Boolean) as Exclude<ConstructorParameters<typeof ImageResponse>[1], undefined>["fonts"];

  const fontFamily = fonts?.length ? "Space Grotesk" : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          fontFamily,
          background: COLORS.main,
          backgroundImage: `radial-gradient(ellipse 70% 80% at 50% 42%, ${COLORS.brandGlow}, transparent 70%)`,
          padding: 56,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRadius: 20,
            border: `1px solid ${COLORS.border}`,
            background: COLORS.section,
            padding: "64px 72px",
          }}
        >
          {/* Eyebrow pill */}
          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                borderRadius: 10,
                border: `1px solid rgba(139,188,232,0.40)`,
                background: COLORS.main,
                padding: "12px 22px",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: COLORS.brand,
              }}
            >
              Imperium Trader / Options Terminal
            </div>
          </div>

          {/* Headline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 116,
              fontWeight: 700,
              lineHeight: 1.0,
              letterSpacing: -2,
              textTransform: "uppercase",
              color: COLORS.white,
            }}
          >
            <span>Trade faster.</span>
            <span>Practice safer.</span>
          </div>

          {/* Footer meta */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", width: 96, height: 3, background: COLORS.gold }} />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: 26,
                color: COLORS.muted,
              }}
            >
              <span style={{ fontWeight: 700, color: COLORS.white }}>Imperium Store</span>
              <span style={{ margin: "0 16px" }}>·</span>
              <span>7 Indian brokers · Windows · Linux</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
