import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" &&
          "bg-slate-900 text-white shadow-card hover:bg-slate-800",
        variant === "secondary" &&
          "bg-amber-400 text-slate-900 shadow-card hover:bg-amber-300",
        variant === "ghost" && "bg-transparent text-slate-700 hover:bg-slate-100",
        variant === "outline" &&
          "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
        size === "sm" ? "h-9 px-3 text-sm" : "h-11 px-4 text-sm",
        className,
      )}
      {...props}
    />
  );
}
