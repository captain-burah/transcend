import { CircleDollarSign, FileText, Network, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ActivityItem } from "@/types/crm";

const categoryIcon = {
  lead: Users,
  listing: Network,
  deal: CircleDollarSign,
  document: FileText,
};

type ActivityFeedProps = {
  items: ActivityItem[];
};

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <Card>
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-950">Recent activity</h2>
        <p className="mt-1 text-sm text-slate-500">Lead routing, portal sync, deals, and signing events</p>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => {
          const Icon = categoryIcon[item.category];

          return (
            <div key={item.id} className={`group animate-in flex gap-3 rounded-2xl p-2 transition duration-150 hover:bg-slate-50 stagger-${Math.min(index + 1, 4)}`}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition group-hover:bg-amber-100 group-hover:text-amber-700">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.14em] text-slate-400">{item.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
