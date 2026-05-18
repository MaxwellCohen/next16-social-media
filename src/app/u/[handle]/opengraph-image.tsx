import { ImageResponse } from 'next/og';
import { getUserByHandle } from '@/data/queries/user';
import { formatCount } from '@/lib/utils';

export const size = { height: 630, width: 1200 };
export const contentType = 'image/png';
export const alt = 'Profile on Drop';

export default async function OpenGraphImage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const user = await getUserByHandle(handle);
  const initial = user.displayName.charAt(0).toUpperCase();
  return new ImageResponse(
    <div
      style={{
        background: '#000',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        height: '100%',
        justifyContent: 'center',
        padding: 80,
        width: '100%',
      }}
    >
      <div style={{ alignItems: 'center', display: 'flex', gap: 32 }}>
        <div
          style={{
            alignItems: 'center',
            background: 'linear-gradient(135deg, #ec4899, #e11d48)',
            borderRadius: 999,
            color: '#fff',
            display: 'flex',
            fontSize: 80,
            fontWeight: 600,
            height: 160,
            justifyContent: 'center',
            width: 160,
          }}
        >
          {initial}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: '-0.02em' }}>{user.displayName}</div>
          <div style={{ color: '#9ca3af', fontSize: 36 }}>@{user.handle}</div>
        </div>
      </div>
      <div style={{ color: '#fff', fontSize: 32, lineHeight: 1.3 }}>{user.bio}</div>
      <div style={{ color: '#9ca3af', display: 'flex', fontSize: 28, gap: 40 }}>
        <span>
          <strong style={{ color: '#fff' }}>{formatCount(user.following)}</strong> Following
        </span>
        <span>
          <strong style={{ color: '#fff' }}>{formatCount(user.followers)}</strong> Followers
        </span>
      </div>
      <div style={{ alignItems: 'center', display: 'flex', gap: 16, marginTop: 24 }}>
        <svg width="40" height="48" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0 Q4 14 2 22 A10 10 0 1 0 22 22 Q20 14 12 0 Z" fill="#2563eb" />
        </svg>
        <span style={{ color: '#9ca3af', fontSize: 24, fontWeight: 600 }}>drop</span>
      </div>
    </div>,
    size,
  );
}
