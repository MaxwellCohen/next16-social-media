import { ImageResponse } from 'next/og';

export const size = { height: 630, width: 1200 };
export const contentType = 'image/png';
export const alt = 'Drop — a dev-flavored social network';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        background: '#000',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        height: '100%',
        justifyContent: 'flex-end',
        padding: 80,
        width: '100%',
      }}
    >
      <svg width="100" height="120" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0 Q4 14 2 22 A10 10 0 1 0 22 22 Q20 14 12 0 Z" fill="#2563eb" />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: '-0.04em' }}>drop</div>
        <div style={{ color: '#9ca3af', fontSize: 32 }}>A dev-flavored social network.</div>
      </div>
    </div>,
    size,
  );
}
