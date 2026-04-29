import { BarChart3, CircleDollarSign, Target } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Reports & Analytics"
        title="Management-ready reporting"
        description="Executive dashboards, conversion analytics, listing performance, commission visibility, and target tracking."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          {
            icon: BarChart3,
            title: "Lead and pipeline analytics",
            text: "Source attribution, stage conversion, follow-up efficiency, stale lead analysis, and agent leaderboard trends.",
          },
          {
            icon: CircleDollarSign,
            title: "Financial reporting",
            text: "Revenue, deal values, commission approvals, payout status, and accounts-ready export pathways.",
          },
          {
            icon: Target,
            title: "Target management",
            text: "Monthly, quarterly, and team targets with progress bars, rankings, and coaching visibility for managers.",
          },
        ].map((item) => (
          <Card key={item.title}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
              <item.icon className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-950">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-500">{item.text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
