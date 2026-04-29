import { cn } from "@/lib/utils";

type BadgeProps = {
  children: string;
  tone?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
};

export function Badge({ children, tone = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        tone === "default" && "bg-slate-100 text-slate-700",
        tone === "success" && "bg-emerald-50 text-emerald-700",
        tone === "warning" && "bg-amber-50 text-amber-700",
        tone === "danger" && "bg-rose-50 text-rose-700",
        tone === "info" && "bg-blue-50 text-blue-700",
        className,
      )}
    >
      {children}
    </span>
  );
}
