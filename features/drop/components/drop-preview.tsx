'use client';

import { useEffect, useState } from 'react';
import { highlightCode } from '@/features/drop/drop-actions';
import { splitCode, tokenizeText, type Token } from '@/features/drop/drop-format';

export function DropPreview({ body }: { body: string }) {
  const trimmed = body.trim();
  if (!trimmed) {
    return <p className="text-gray text-[15px]">Nothing to preview yet.</p>;
  }
  const segments = splitCode(trimmed);
  return (
    <div className="flex flex-col gap-2">
      {segments.map((segment, i) => {
        if (segment.type === 'code') {
          return <PreviewCodeBlock key={`${i}-${segment.code}`} code={segment.code} lang={segment.lang} />;
        }
        return (
          <p key={i} className="text-[15px] leading-snug text-black dark:text-white">
            {renderText(segment.text)}
          </p>
        );
      })}
    </div>
  );
}

const codeClass =
  'border-divider bg-card dark:border-divider-dark dark:bg-card-dark overflow-x-auto rounded-sm border p-3 font-mono text-xs leading-relaxed';

function PreviewCodeBlock({ code, lang }: { code: string; lang: string }) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    highlightCode(code, lang).then(result => {
      if (active) setHtml(result);
    });
    return () => {
      active = false;
    };
  }, [code, lang]);

  if (html) {
    return <div className={`shiki-block ${codeClass}`} dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return <pre className={codeClass}>{code}</pre>;
}

function renderText(text: string) {
  const lines = tokenizeText(text);
  return lines.flatMap((tokens, lineIdx) => {
    const parts = tokens.map((token, i) => renderToken(token, `${lineIdx}-${i}`));
    if (lineIdx < lines.length - 1) {
      parts.push(<br key={`br-${lineIdx}`} />);
    }
    return parts;
  });
}

function renderToken(token: Token, key: string) {
  switch (token.type) {
    case 'bold':
      return (
        <strong key={key} className="font-semibold">
          {token.text}
        </strong>
      );
    case 'italic':
      return <em key={key}>{token.text}</em>;
    case 'tag':
      return (
        <span key={key} className="text-accent">
          #{token.tag}
        </span>
      );
    case 'url':
      return (
        <span key={key} className="text-accent break-all">
          {token.url.replace(/^https?:\/\//, '')}
        </span>
      );
    default:
      return <span key={key}>{token.text}</span>;
  }
}
