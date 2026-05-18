import { highlight } from '@/lib/syntax';

type Props = {
  lang: string;
  code: string;
};

export async function CodeBlock({ lang, code }: Props) {
  const html = await highlight(code, lang);

  return (
    <div
      className="shiki-block border-divider bg-card dark:border-divider-dark dark:bg-card-dark overflow-x-auto rounded-sm border p-3 font-mono text-xs leading-relaxed"
      // Shiki produces escaped HTML; safe to inject.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
