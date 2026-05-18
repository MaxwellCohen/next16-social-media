import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="22" height="28" viewBox="0 0 24 32" fill="none">
          <path d="M12 0 L0 24 A12 12 0 0 0 12 32 Z" fill="#fff" />
          <path d="M12 0 L24 24 A12 12 0 0 1 12 32 Z" fill="#1b50ff" />
        </svg>
      </div>
    ),
    size,
  );
}
