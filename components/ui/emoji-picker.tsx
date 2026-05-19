'use client';

import { CUSTOM_EMOJIS } from '@/components/ui/custom-emoji';

type Props = {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
};

export function EmojiPicker({ textareaRef }: Props) {
  function insert(shortcode: string) {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
    nativeInputValueSetter?.call(textarea, value.slice(0, start) + shortcode + value.slice(end));
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = start + shortcode.length;
  }

  return (
    <div className="flex items-center gap-0.5">
      {CUSTOM_EMOJIS.map(e => {
        return (
          <button
            key={e.name}
            type="button"
            aria-label={e.label}
            title={e.label}
            onClick={() => {
              return insert(e.shortcode);
            }}
            className="text-gray hover:text-accent hover:bg-card dark:hover:bg-card-dark rounded-md p-1.5 transition-colors"
          >
            <e.icon size={16} />
          </button>
        );
      })}
    </div>
  );
}
