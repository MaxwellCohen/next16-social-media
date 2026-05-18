import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "card";

type Props<R extends string> = {
  href: Route<R>;
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

const base = "inline-flex items-center gap-2 text-sm font-bold tracking-wide uppercase";

const variants: Record<Variant, string> = {
  primary: "bg-accent hover:bg-accent-hover px-6 py-3 text-white",
  secondary: "border-accent hover:bg-accent-fade border px-6 py-3",
  card:
    "border-divider dark:border-divider-dark hover:border-accent dark:bg-card-dark flex flex-col items-center border bg-white p-4 text-center",
};

export function LinkButton<R extends string>({
  href,
  children,
  variant = "card",
  className,
}: Props<R>) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {children}
    </Link>
  );
}
