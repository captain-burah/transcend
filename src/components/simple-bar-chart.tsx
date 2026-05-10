import { cn } from "@/lib/utils";

type SimpleBarChartProps = {
  data: Array<{ label: string; value: number }>;
  className?: string;
};

export function SimpleBarChart({ data, className }: SimpleBarChartProps) {
  const max = Math.max(...data.map((item) => item.value));

  return (
    <div className={cn("space-y-4", className)}>
      {data.map((item, index) => (
        <div key={item.label} className={`animate-in space-y-1.5 stagger-${Math.min(index + 1, 4)}`}>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">{item.label}</span>
            <span className="text-slate-500">{item.value}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="bar-fill h-2.5 rounded-full bg-gradient-to-r from-slate-900 to-amber-400"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
