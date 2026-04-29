import { AlertTriangle, RefreshCcw, Wifi } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function PortalsPage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Portal Integration Center"
        title="Provider operations and sync control"
        description="Property Finder API, Bayut feed adapter, Dubizzle feed adapter, publication logs, and lead ingestion."
        action={<Button>Retry Failed Syncs</Button>}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          ["Property Finder", "Healthy", "132 active listings synced", "success"],
          ["Bayut", "Degraded", "7 payload warnings in last 24h", "warning"],
          ["Dubizzle", "Attention", "3 publication failures require mapping fix", "danger"],
        ].map(([name, status, meta, tone]) => (
          <Card key={name}>
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
                <Wifi className="h-5 w-5" />
              </div>
              <Badge tone={tone as "success" | "warning" | "danger"}>{status}</Badge>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-950">{name}</h2>
            <p className="mt-2 text-sm text-slate-500">{meta}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <RefreshCcw className="h-4 w-4 text-blue-600" />
            <h2 className="text-base font-semibold text-slate-950">Sync and publication logs</h2>
          </div>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl border border-slate-100 p-4">
              PF publish success: DRE-2026-00196 transformed and accepted.
            </div>
            <div className="rounded-2xl border border-slate-100 p-4">
              Bayut update pending retry after upstream timeout.
            </div>
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-rose-700">
              Dubizzle reject: unsupported location id for Jumeirah Golf Estates mapping.
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <h2 className="text-base font-semibold text-slate-950">Lead ingestion logs</h2>
          </div>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 p-4">
              New Property Finder lead created, assigned by Downtown investor rule, AI score queued.
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              New Facebook Zapier webhook stored raw, normalized, and converted into lead + activity.
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              WhatsApp inbound linked to existing lead after phone-based match.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
