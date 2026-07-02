import { ImageResponse } from "next/og";

/**
 * App icon (512×512 PNG, build-time generated) — the pot-and-steam mark on
 * the amber square. Generous padding keeps it safe under maskable cropping
 * (the manifest lists it for both `any` and `maskable`).
 */
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#d97706",
        }}
      >
        <svg
          width={300}
          height={300}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 13h16" />
          <path d="M5 13v1.5a5 5 0 0 0 5 5h4a5 5 0 0 0 5-5V13" />
          <path d="M8 9.8c1.2-1.2 1.2-3 0-4.2" />
          <path d="M12.2 9.8c1-1 1-2.4 0-3.4" />
          <path d="M16.2 9.8c.8-.8.8-1.8 0-2.6" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
