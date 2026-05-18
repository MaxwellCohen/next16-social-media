import { cn } from "@/lib/utils";

type Props = {
  name: string;
  color: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
} as const;

export function Avatar({ name, color, size = "md", className }: Props) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-gradient-to-br font-semibold uppercase text-white",
        color,
        sizes[size],
        className,
      )}
      aria-hidden
    >
      {initial}
    </div>
  );
}
