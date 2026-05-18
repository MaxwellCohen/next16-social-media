import DOMPurify from 'isomorphic-dompurify';
import { CopyButton } from '@/components/ui/CopyButton';
import { highlight } from '@/lib/syntax';

type Props = {
  lang: string;
  code: string;
};

export async function CodeBlock({ lang, code }: Props) {
  const html = await highlight(code, lang);
  const safe = DOMPurify.sanitize(html, {
    ALLOWED_ATTR: ['class', 'style', 'tabindex'],
    ALLOWED_TAGS: ['pre', 'code', 'span', 'div', 'br'],
  });

  return (
    <div className="group/code relative">
      <CopyButton code={code} />
      <div
        className="shiki-block border-divider bg-card dark:border-divider-dark dark:bg-card-dark overflow-x-auto rounded-sm border p-3 font-mono text-xs leading-relaxed"
        dangerouslySetInnerHTML={{ __html: safe }}
      />
    </div>
  );
}
