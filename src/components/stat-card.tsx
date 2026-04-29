import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { KPI } from "@/types/crm";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({ label, value, delta, trend, description }: KPI) {
  const TrendIcon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-amber-100/70 blur-3xl" />
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <div
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
            trend === "up" && "bg-emerald-50 text-emerald-700",
            trend === "down" && "bg-rose-50 text-rose-700",
            trend === "neutral" && "bg-slate-100 text-slate-700",
          )}
        >
          <TrendIcon className="h-3.5 w-3.5" />
          {delta}
        </div>
      </div>
    </Card>
  );
}
