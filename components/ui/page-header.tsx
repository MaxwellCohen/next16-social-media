'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Props = {
  children: React.ReactNode;
  back?: boolean;
};

export function PageHeader({ children, back }: Props) {
  const router = useRouter();
  return (
    <header className="border-divider/70 dark:border-divider-dark/70 sticky top-0 z-30 flex items-center gap-3 border-b bg-white/70 px-4 py-4 backdrop-blur-md backdrop-saturate-150 sm:px-5 dark:bg-black/70">
      {back ? (
        <button
          type="button"
          aria-label="Go back"
          onClick={() => {
            router.back();
          }}
          className="text-gray -ml-1 rounded-full p-1 transition-colors hover:text-black dark:hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      ) : null}
      {children}
    </header>
  );
}
