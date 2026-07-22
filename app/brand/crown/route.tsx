import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET() {
  const response = new ImageResponse(
    (
      <div
        style={{
          width: "64px",
          height: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#BC7C33",
          background: "transparent",
        }}
      >
        <svg width="44" height="33" viewBox="0 0 20 15" fill="none">
          <path
            d="M1.5 13.2 3 4.2l4 4 3-6 3 6 4-4 1.5 9z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          <rect x="1.5" y="12.4" width="17" height="2.1" rx="0.6" fill="currentColor" />
        </svg>
      </div>
    ),
    { width: 64, height: 48 },
  );
  response.headers.set("Cache-Control", "public, max-age=86400, s-maxage=604800");
  return response;
}
