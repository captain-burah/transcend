import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export function Card({ className, children }: CardProps) {
  return (
    <section
      className={cn(
        "animate-in rounded-2xl border border-white/70 bg-white/90 p-5 shadow-card backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-amber-200 hover:bg-white hover:shadow-soft",
        className,
      )}
    >
      {children}
    </section>
  );
}
