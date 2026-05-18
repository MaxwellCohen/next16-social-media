type Props = {
  lang: string;
  code: string;
};

export function CodeBlock({ lang, code }: Props) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-divider bg-card p-3 font-mono text-xs leading-relaxed text-black dark:border-divider-dark dark:bg-card-dark dark:text-white">
      <code data-lang={lang}>{code}</code>
    </pre>
  );
}
