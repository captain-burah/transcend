import { Filter, Plus, SlidersHorizontal } from "lucide-react";
import { leads } from "@/data/mock-crm";
import { DataTable } from "@/components/data-table";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export function LeadsPage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Lead Management"
        title="Lead command view"
        description="Saved views, AI scoring, bulk operations, source tracking, and next-best-action guidance."
        action={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Lead
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <DataTable
          title="All leads"
          description="Table, compact, and kanban views can share the same query and saved filters"
          rows={leads}
          columns={[
            {
              key: "lead",
              label: "Lead",
              render: (lead) => (
                <div>
                  <p className="font-semibold text-slate-900">{lead.name}</p>
                  <p className="text-sm text-slate-500">{lead.intent}</p>
                </div>
              ),
            },
            { key: "source", label: "Source", render: (lead) => lead.source },
            { key: "stage", label: "Stage", render: (lead) => lead.stage },
            {
              key: "temperature",
              label: "Temp",
              render: (lead) => (
                <Badge
                  tone={
                    lead.temperature === "Hot"
                      ? "danger"
                      : lead.temperature === "Warm"
                        ? "warning"
                        : "default"
                  }
                >
                  {lead.temperature}
                </Badge>
              ),
            },
            {
              key: "score",
              label: "Score",
              render: (lead) => <span className="font-semibold">{lead.score}</span>,
            },
            { key: "owner", label: "Owner", render: (lead) => lead.agent },
            {
              key: "budget",
              label: "Budget",
              render: (lead) => formatCurrency(lead.budgetAed),
            },
          ]}
        />

        <div className="space-y-4">
          <Card>
            <div className="mb-4 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-slate-500" />
              <h2 className="text-base font-semibold text-slate-950">Saved views</h2>
            </div>
            <div className="space-y-2">
              {[
                "High intent buyers this week",
                "No-response leads > 24h",
                "Facebook investor leads",
                "Warm WhatsApp conversations",
              ].map((view) => (
                <button
                  key={view}
                  className="w-full rounded-2xl border border-slate-100 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  {view}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-base font-semibold text-slate-950">AI recommendations</h2>
            <div className="mt-4 space-y-3">
              {[
                "Escalate Maha Al Suwaidi to manager review before viewing.",
                "Re-engage Yousef Rahman using a villa-focused WhatsApp template.",
                "Create duplicate detection warning for Oliver Bennett's Bayut inquiry.",
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
