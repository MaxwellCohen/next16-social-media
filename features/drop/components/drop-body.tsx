import Link from 'next/link';
import { CodeBlock } from '@/components/ui/code-block';
import { renderCustomEmojis } from '@/components/ui/custom-emoji';

type Props = {
  body: string;
  compact?: boolean;
  detail?: boolean;
};

export function DropBody({ body, compact = false, detail = false }: Props) {
  const segments = splitCode(body);
  return (
    <div className="flex flex-col gap-2">
      {segments.map((segment, i) => {
        if (segment.type === 'code') {
          if (compact) return null;
          return (
            <div key={i} className="relative z-20">
              <CodeBlock lang={segment.lang} code={segment.code} />
            </div>
          );
        }
        return (
          <p
            key={i}
            className={
              detail
                ? 'text-[17px] leading-relaxed text-black dark:text-white'
                : 'text-[15px] leading-snug text-black dark:text-white'
            }
          >
            {renderText(segment.text)}
          </p>
        );
      })}
    </div>
  );
}

type Segment = { type: 'text'; text: string } | { type: 'code'; lang: string; code: string };

const FENCE = /```(\w*)\n([\s\S]*?)\n?```/g;

function splitCode(body: string): Segment[] {
  const segments: Segment[] = [];
  let lastIndex = 0;
  for (const match of body.matchAll(FENCE)) {
    const start = match.index ?? 0;
    if (start > lastIndex) {
      const text = body.slice(lastIndex, start).trim();
      if (text) segments.push({ text, type: 'text' });
    }
    segments.push({ code: match[2], lang: match[1] || 'bash', type: 'code' });
    lastIndex = start + match[0].length;
  }
  if (lastIndex < body.length) {
    const text = body.slice(lastIndex).trim();
    if (text) segments.push({ text, type: 'text' });
  }
  if (segments.length === 0) {
    segments.push({ text: body, type: 'text' });
  }
  return segments;
}

function renderText(text: string) {
  const parts = text.split(/(#\w+)/g);
  return parts.map((part, i) => {
    if (part.startsWith('#')) {
      const tag = part.slice(1);
      return (
        <Link key={i} href={`/tag/${tag}`} className="text-accent relative z-20 hover:underline">
          {part}
        </Link>
      );
    }
    return <span key={i}>{renderCustomEmojis(part)}</span>;
  });
}
