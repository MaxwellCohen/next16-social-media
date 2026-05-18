import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

type Props = {
  children: ReactNode;
  variant?: Variant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const base =
  "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold tracking-wide uppercase transition-colors focus:ring-2 focus:outline-none focus:ring-offset-2 dark:focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover focus:ring-accent",
  secondary:
    "bg-card dark:bg-card-dark border border-divider dark:border-divider-dark text-black dark:text-white hover:bg-gray-200 dark:hover:bg-[#1a1a1a] focus:ring-accent",
  ghost:
    "text-gray hover:text-black dark:hover:text-white focus:ring-accent",
};

export function Button({
  children,
  variant = "primary",
  className,
  type = "button",
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
