import { ArrowUpRight, Clock3 } from "lucide-react";
import {
  activities,
  chartSeries,
  dashboardHighlights,
  executiveKpis,
  leads,
  listings,
} from "@/data/mock-crm";
import { ActivityFeed } from "@/components/activity-feed";
import { DataTable } from "@/components/data-table";
import { SectionHeading } from "@/components/section-heading";
import { SimpleBarChart } from "@/components/simple-bar-chart";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Executive Dashboard"
        title="Brokerage command center"
        description="Role-aware performance view spanning leads, listings, commissions, sync health, and pending signatures."
        action={
          <div className="flex gap-2">
            <Button variant="outline">Export Snapshot</Button>
            <Button>View Reports</Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {executiveKpis.map((kpi) => (
          <StatCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-950">Lead source performance</h2>
              <p className="mt-1 text-sm text-slate-500">
                Current 30-day intake across portals, social, and WhatsApp
              </p>
            </div>
            <Badge tone="info">Updated live</Badge>
          </div>
          <SimpleBarChart data={chartSeries} />
        </Card>

        <Card>
          <div className="mb-5">
            <h2 className="text-base font-semibold text-slate-950">Operational pulse</h2>
            <p className="mt-1 text-sm text-slate-500">
              Immediate priorities for managers and brokerage admins
            </p>
          </div>
          <div className="space-y-3">
            {dashboardHighlights.map((highlight) => (
              <div
                key={highlight.label}
                className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm">
                  <highlight.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{highlight.label}</p>
                  <p className="mt-1 text-xl font-semibold text-slate-950">{highlight.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{highlight.meta}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.95fr]">
        <DataTable
          title="Stale and high-value leads"
          description="AI-scored opportunities that need immediate follow-up or escalation"
          rows={leads}
          columns={[
            {
              key: "lead",
              label: "Lead",
              render: (lead) => (
                <div>
                  <p className="font-semibold text-slate-900">{lead.name}</p>
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">{lead.id}</p>
                </div>
              ),
            },
            { key: "source", label: "Source", render: (lead) => lead.source },
            { key: "stage", label: "Stage", render: (lead) => lead.stage },
            {
              key: "score",
              label: "AI Score",
              render: (lead) => <Badge tone="info">{String(lead.score)}</Badge>,
            },
            { key: "agent", label: "Owner", render: (lead) => lead.agent },
            {
              key: "budget",
              label: "Budget",
              render: (lead) => formatCurrency(lead.budgetAed),
            },
          ]}
        />

        <ActivityFeed items={activities} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <DataTable
          title="Listing publication health"
          description="Readiness, portal coverage, and sync risk across active inventory"
          rows={listings}
          columns={[
            {
              key: "title",
              label: "Listing",
              render: (listing) => (
                <div>
                  <p className="font-semibold text-slate-900">{listing.title}</p>
                  <p className="text-sm text-slate-500">{listing.community}</p>
                </div>
              ),
            },
            { key: "ref", label: "Ref", render: (listing) => listing.ref },
            {
              key: "status",
              label: "Status",
              render: (listing) => (
                <Badge
                  tone={
                    listing.status === "Published"
                      ? "success"
                      : listing.status === "Error"
                        ? "danger"
                        : listing.status === "Ready"
                          ? "info"
                          : "default"
                  }
                >
                  {listing.status}
                </Badge>
              ),
            },
            {
              key: "portals",
              label: "Portals",
              render: (listing) => listing.portals.join(", "),
            },
          ]}
        />

        <Card>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-950">Pending approvals</h2>
              <p className="mt-1 text-sm text-slate-500">High-sensitivity approvals and deadlines</p>
            </div>
            <Button variant="ghost" className="gap-2">
              Open queue
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {[
              "3 SPA signature requests expiring today",
              "11 commission payouts awaiting accounts review",
              "7 portal sync errors require manual correction",
              "4 listing drafts missing Arabic description blocks",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-100 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                  <Clock3 className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
