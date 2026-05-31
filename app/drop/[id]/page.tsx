import { getDrop } from '@/features/drop/drop-queries';
import { getUserByHandle } from '@/features/user/user-queries';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: PageProps<'/drop/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const drop = await getDrop(id);
  const author = await getUserByHandle(drop.authorHandle);
  const snippet = drop.body.length > 60 ? `${drop.body.slice(0, 57).trimEnd()}…` : drop.body;
  const title = `${author.displayName}: ${snippet}`;
  const description = drop.body.length > 160 ? `${drop.body.slice(0, 157)}…` : drop.body;
  return {
    alternates: { canonical: `/drop/${id}` },
    description,
    openGraph: { authors: [author.displayName], type: 'article' },
    title,
  };
}

export default function DropPage({ params }: PageProps<'/drop/[id]'>) {
  return (
    <div>
      {/* Page header */}
      {/* Drop detail: full post with author info */}
      {/* Reply composer: input with avatar */}
      {/* Replies: list of replies */}
    </div>
  );
}
