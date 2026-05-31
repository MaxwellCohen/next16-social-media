import type { Metadata } from 'next';

export const metadata: Metadata = {
  description: 'A drop on drop.',
  title: 'Drop',
};

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
