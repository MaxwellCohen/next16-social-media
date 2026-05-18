import type { Drop as PrismaDrop } from '@/generated/prisma/client';

export type EmbeddedCode = { lang: string; code: string };

export type Drop = {
  id: string;
  authorHandle: string;
  body: string;
  createdAt: Date;
  likes: number;
  replies: number;
  reposts: number;
  tags: string[];
  embeddedCode?: EmbeddedCode;
  parentId?: string;
};

export function toDrop(row: PrismaDrop): Drop {
  return {
    authorHandle: row.authorHandle,
    body: row.body,
    createdAt: row.createdAt,
    embeddedCode: row.embeddedLang && row.embeddedCode ? { code: row.embeddedCode, lang: row.embeddedLang } : undefined,
    id: row.id,
    likes: row.likeCount,
    parentId: row.parentId ?? undefined,
    replies: row.replyCount,
    reposts: row.repostCount,
    tags: row.tags ? row.tags.split(',').filter(Boolean) : [],
  };
}
