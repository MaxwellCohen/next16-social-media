import Link from "next/link";
import { getTrendingTags } from "@/data/queries/tag";
import { formatCount } from "@/lib/utils";

export async function TrendingTags() {
  const tags = await getTrendingTags();
  return (
    <section className="border-divider dark:border-divider-dark border">
      <header className="border-divider dark:border-divider-dark border-b px-4 py-3">
        <h3 className="text-xs font-bold tracking-wide uppercase">
          Trending now
        </h3>
      </header>
      <ul>
        {tags.map((tag) => (
          <li
            key={tag.name}
            className="border-divider dark:border-divider-dark border-b last:border-b-0"
          >
            <Link
              href={`/tag/${tag.name}`}
              className="hover:bg-card dark:hover:bg-card-dark flex items-center justify-between px-4 py-3 transition-colors"
            >
              <span className="text-accent font-mono text-sm">
                #{tag.name}
              </span>
              <span className="text-gray font-mono text-xs">
                {formatCount(tag.count)} drops
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function TrendingTagsSkeleton() {
  return (
    <section className="border-divider dark:border-divider-dark border">
      <header className="border-divider dark:border-divider-dark border-b px-4 py-3">
        <h3 className="text-xs font-bold tracking-wide uppercase">
          Trending now
        </h3>
      </header>
      <ul>
        {Array.from({ length: 5 }).map((_, i) => (
          <li
            key={i}
            className="border-divider dark:border-divider-dark border-b px-4 py-3 last:border-b-0"
          >
            <div className="skeleton-animation h-4 w-32" />
          </li>
        ))}
      </ul>
    </section>
  );
}
