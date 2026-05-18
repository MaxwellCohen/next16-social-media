import Link from "next/link";

type Props = {
  tag: string;
};

export function TagPill({ tag }: Props) {
  return (
    <Link
      href={`/tag/${tag}`}
      className="inline-flex items-center rounded-full border border-divider px-2.5 py-0.5 font-mono text-[11px] text-gray transition-colors hover:border-accent hover:text-accent dark:border-divider-dark"
    >
      #{tag}
    </Link>
  );
}
