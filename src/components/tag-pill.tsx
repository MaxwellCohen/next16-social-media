import Link from "next/link";

type Props = {
  tag: string;
};

export function TagPill({ tag }: Props) {
  return (
    <Link
      href={`/tag/${tag}`}
      className="border-accent text-accent hover:bg-accent-fade inline-flex items-center border px-2 py-0.5 font-mono text-xs uppercase tracking-wide"
    >
      #{tag}
    </Link>
  );
}
