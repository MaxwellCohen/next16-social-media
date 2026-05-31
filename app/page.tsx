function parseTab(value: string | string[] | undefined): 'following' | 'discover' {
  return value === 'discover' ? 'discover' : 'following';
}

function parsePage(value: string | string[] | undefined): number {
  const n = Number(value);
  return n > 0 && Number.isInteger(n) ? n : 1;
}

export default function HomePage({ searchParams }: PageProps<'/'>) {
  return (
    <div className="group/tabs">
      <div className="sticky top-0 z-30 bg-white/70 backdrop-blur-md backdrop-saturate-150 dark:bg-black/70">
        {/* Tabs: following / discover */}
      </div>
      {/* Composer: new drop form */}
      <div className="transition-opacity group-has-data-pending/tabs:opacity-50">{/* Feed: list of drops */}</div>
    </div>
  );
}
