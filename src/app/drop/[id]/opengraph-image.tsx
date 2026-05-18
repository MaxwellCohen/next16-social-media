import { ImageResponse } from 'next/og';
import { getDrop } from '@/data/queries/drop';
import { getUserByHandle } from '@/data/queries/user';

export const size = { height: 630, width: 1200 };
export const contentType = 'image/png';
export const alt = 'A drop on Drop';

export default async function OpenGraphImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const drop = await getDrop(id);
  const author = await getUserByHandle(drop.authorHandle);
  const initial = author.displayName.charAt(0).toUpperCase();
  const body = drop.body.length > 220 ? `${drop.body.slice(0, 217)}…` : drop.body;
  return new ImageResponse(
    <div
      style={{
        background: '#000',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: 40,
        height: '100%',
        justifyContent: 'space-between',
        padding: 80,
        width: '100%',
      }}
    >
      <div style={{ alignItems: 'center', display: 'flex', gap: 24 }}>
        <div
          style={{
            alignItems: 'center',
            background: 'linear-gradient(135deg, #ec4899, #e11d48)',
            borderRadius: 999,
            color: '#fff',
            display: 'flex',
            fontSize: 56,
            fontWeight: 600,
            height: 96,
            justifyContent: 'center',
            width: 96,
          }}
        >
          {initial}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 40, fontWeight: 700 }}>{author.displayName}</div>
          <div style={{ color: '#9ca3af', fontSize: 28 }}>@{author.handle}</div>
        </div>
      </div>
      <div style={{ color: '#fff', fontSize: 44, lineHeight: 1.3 }}>{body}</div>
      <div style={{ alignItems: 'center', display: 'flex', gap: 16 }}>
        <svg width="48" height="56" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0 Q4 14 2 22 A10 10 0 1 0 22 22 Q20 14 12 0 Z" fill="#2563eb" />
        </svg>
        <span style={{ color: '#9ca3af', fontSize: 28, fontWeight: 600 }}>drop</span>
      </div>
    </div>,
    size,
  );
}
