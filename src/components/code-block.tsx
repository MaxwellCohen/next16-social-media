type Props = {
  lang: string;
  code: string;
};

export function CodeBlock({ lang, code }: Props) {
  return (
    <pre className="border-divider dark:border-divider-dark dark:bg-card-dark overflow-x-auto border bg-gray-50 p-3 font-mono text-xs leading-relaxed text-black dark:text-white">
      <code data-lang={lang}>{code}</code>
    </pre>
  );
}
