import { Bold, Code2, Eye, Hash, Italic, PenLine } from 'lucide-react';
import type { ReactNode } from 'react';
import { ClientOnly } from '@/components/ui/client-only';
import { cn } from '@/lib/utils';

type Size = 'sm' | 'md';

type ToolbarButtonProps = {
  label: string;
  onClick: () => void;
  children: ReactNode;
  size?: Size;
};

const sizes: Record<Size, string> = {
  md: 'h-9 w-9',
  sm: 'h-7 w-7',
};

const icons: Record<Size, string> = {
  md: 'h-5 w-5',
  sm: 'h-4 w-4',
};

export function ToolbarButton({ label, onClick, children, size = 'md' }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        'text-accent hover:bg-accent/10 flex items-center justify-center rounded-full transition-colors',
        sizes[size],
      )}
    >
      {children}
    </button>
  );
}

type FormatProps = {
  size?: Size;
  insertAtCaret: (text: string) => void;
  insertSnippet: () => void;
  wrapSelection: (marker: string) => void;
};

export function ComposerFormatActions({ size = 'md', insertAtCaret, insertSnippet, wrapSelection }: FormatProps) {
  const icon = icons[size];
  return (
    <ClientOnly>
      <ToolbarButton size={size} label="Bold" onClick={() => wrapSelection('**')}>
        <Bold className={icon} />
      </ToolbarButton>
      <ToolbarButton size={size} label="Italic" onClick={() => wrapSelection('*')}>
        <Italic className={icon} />
      </ToolbarButton>
      <ToolbarButton size={size} label="Add code snippet" onClick={insertSnippet}>
        <Code2 className={icon} />
      </ToolbarButton>
      <ToolbarButton size={size} label="Add hashtag" onClick={() => insertAtCaret('#')}>
        <Hash className={icon} />
      </ToolbarButton>
    </ClientOnly>
  );
}

type PreviewProps = {
  size?: Size;
  mode: 'write' | 'preview';
  onPreview: () => void;
  onEdit: () => void;
};

export function ComposerPreviewToggle({ size = 'md', mode, onPreview, onEdit }: PreviewProps) {
  const icon = icons[size];
  return (
    <ClientOnly>
      {mode === 'write' ? (
        <ToolbarButton size={size} label="Preview" onClick={onPreview}>
          <Eye className={icon} />
        </ToolbarButton>
      ) : (
        <ToolbarButton size={size} label="Edit" onClick={onEdit}>
          <PenLine className={icon} />
        </ToolbarButton>
      )}
    </ClientOnly>
  );
}
