export type Segment = { type: 'text'; text: string } | { type: 'code'; lang: string; code: string };

const FENCE = /```(\w*)\n([\s\S]*?)\n?```/g;

export function splitCode(body: string): Segment[] {
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

export type Token =
  | { type: 'text'; text: string }
  | { type: 'bold'; text: string }
  | { type: 'italic'; text: string }
  | { type: 'tag'; tag: string }
  | { type: 'url'; url: string };

// Order matters: bold (`**`) must precede italic (`*`) so `**x**` isn't read as two `*`.
const BOLD_RE = /(\*\*[^*\n]+\*\*)/g;
const ITALIC_RE = /(\*[^*\n]+\*)/g;
const URL_RE = /(https?:\/\/[^\s<]+)/g;
const TAG_RE = /(#\w+)/g;
const TOKEN_RE = new RegExp(`${BOLD_RE.source}|${ITALIC_RE.source}|${URL_RE.source}|${TAG_RE.source}`, 'g');

function classify(part: string): Token {
  if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
    return { text: part.slice(2, -2), type: 'bold' };
  }
  if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
    return { text: part.slice(1, -1), type: 'italic' };
  }
  if (part.startsWith('#')) {
    return { tag: part.slice(1), type: 'tag' };
  }
  if (part.match(/^https?:\/\//)) {
    return { type: 'url', url: part };
  }
  return { text: part, type: 'text' };
}

export function tokenizeText(text: string): Token[][] {
  return text.split('\n').map(line => line.split(TOKEN_RE).filter(Boolean).map(classify));
}
