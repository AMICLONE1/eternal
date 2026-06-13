/**
 * Brand OG card (1200×630) generated at build time — purple field,
 * faithful lockup, location line. Shows on WhatsApp/Instagram/Google shares.
 */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Eternal — For Him & Her | Premium Unisex Salon, Nigdi, Pune";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const jost = await readFile(
    join(process.cwd(), "node_modules/@fontsource/jost/files/jost-latin-400-normal.woff"),
  );
  const cormorant = await readFile(
    join(
      process.cwd(),
      "node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff",
    ),
  );
  const quicksand = await readFile(
    join(process.cwd(), "node_modules/@fontsource/quicksand/files/quicksand-latin-600-normal.woff"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#7C4FB5",
          fontFamily: "Jost",
        }}
      >
        <div style={{ display: "flex", fontFamily: "Quicksand", fontSize: 150, fontWeight: 600 }}>
          <span style={{ color: "#E2A32D", letterSpacing: -9 }}>ete</span>
          <span style={{ color: "#FFFFFF", letterSpacing: 1 }}>rnal</span>
        </div>
        <div style={{ width: 420, height: 1.5, backgroundColor: "rgba(255,255,255,0.55)", marginTop: 18 }} />
        <div style={{ color: "#FFFFFF", fontSize: 30, letterSpacing: 18, marginTop: 22 }}>
          FOR HIM &amp; HER
        </div>
        <div
          style={{
            color: "#E8D9A8",
            fontSize: 34,
            fontFamily: "Cormorant",
            fontStyle: "italic",
            marginTop: 48,
          }}
        >
          Beauty that lasts, eternally yours.
        </div>
        <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 22, letterSpacing: 6, marginTop: 16 }}>
          PRADHIKARAN · NIGDI · PUNE
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Jost", data: jost, weight: 400, style: "normal" },
        { name: "Cormorant", data: cormorant, weight: 500, style: "italic" },
        { name: "Quicksand", data: quicksand, weight: 600, style: "normal" },
      ],
    },
  );
}
