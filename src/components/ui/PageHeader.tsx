type Props = {
  children: React.ReactNode;
};

export function PageHeader({ children }: Props) {
  return (
    <header className="border-divider/70 dark:border-divider-dark/70 sticky top-0 z-30 border-b bg-white/70 px-4 py-4 backdrop-blur-md backdrop-saturate-150 sm:px-5 dark:bg-black/70">
      {children}
    </header>
  );
}
