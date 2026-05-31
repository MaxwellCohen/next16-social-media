function parseTab(value: string | string[] | undefined): 'following' | 'discover' {
  return value === 'discover' ? 'discover' : 'following';
}

function parsePage(value: string | string[] | undefined): number {
  const n = Number(value);
  return n > 0 && Number.isInteger(n) ? n : 1;
}

export default function HomePage({ searchParams }: PageProps<'/'>) {
  return (
    <div>
      {/* Page header */}
      {/* Tabs: following / discover */}
      {/* Composer: new drop form */}
      {/* Feed: list of drops */}
    </div>
  );
}
