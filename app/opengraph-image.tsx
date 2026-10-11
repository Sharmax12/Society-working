import { ImageResponse } from "next/og";

export const alt = "HallWayLoop — your college community, in one loop";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #faf8f5 0%, #f4e9df 100%)",
          color: "#29231f",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 58,
              height: 58,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 18,
              background: "#d95743",
              color: "#ffffff",
              fontSize: 34,
              fontWeight: 800,
            }}
          >
            H
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -1.1 }}>
            HallWayLoop
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              display: "flex",
              color: "#a94b3c",
              fontSize: 19,
              fontWeight: 700,
              letterSpacing: 4,
            }}
          >
            YOUR COLLEGE COMMUNITY
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 76,
              fontWeight: 800,
              letterSpacing: -4,
              lineHeight: 1.04,
            }}
          >
            <span>Find your people.</span>
            <span>Show up for more.</span>
          </div>
          <div style={{ display: "flex", fontSize: 25, color: "#6f5a52" }}>
            Societies · Events · Campus connections
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(90, 60, 45, .18)",
            paddingTop: 22,
            fontSize: 18,
            color: "#786a61",
          }}
        >
          <span>hallwayloop.com</span>
          <span>Discover. Participate. Belong.</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
