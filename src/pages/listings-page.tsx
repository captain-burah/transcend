import { CheckCircle2, ImagePlus, Send } from "lucide-react";
import { listings } from "@/data/mock-crm";
import { DataTable } from "@/components/data-table";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ListingsPage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Listing Management"
        title="Portal-ready listing workspace"
        description="Separate listing CRUD, autosaved drafts, portal eligibility, publication actions, and sync visibility."
        action={
          <div className="flex gap-2">
            <Button variant="outline">Bulk Publish Prep</Button>
            <Button>Create Draft</Button>
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <DataTable
          title="Listing queue"
          description="Draft, readiness, quality, portal selection, and agent assignment"
          rows={listings}
          columns={[
            {
              key: "listing",
              label: "Listing",
              render: (listing) => (
                <div>
                  <p className="font-semibold text-slate-900">{listing.title}</p>
                  <p className="text-sm text-slate-500">{listing.community}</p>
                </div>
              ),
            },
            { key: "ref", label: "Reference", render: (listing) => listing.ref },
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
              key: "readiness",
              label: "Readiness",
              render: (listing) => `${listing.completeness}%`,
            },
            {
              key: "quality",
              label: "Quality",
              render: (listing) => `${listing.quality}%`,
            },
          ]}
        />

        <div className="space-y-4">
          <Card>
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <h2 className="text-base font-semibold text-slate-950">Create / edit flow</h2>
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              <p>1. Basic Information, Portals, Title & Description</p>
              <p>2. Location mapping, Price, Compliance</p>
              <p>3. Additional info, Assignment, Images, Amenities</p>
              <p>4. Draft autosave, eligibility checks, separate publish action</p>
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center gap-2">
              <ImagePlus className="h-4 w-4 text-amber-600" />
              <h2 className="text-base font-semibold text-slate-950">Media and sync health</h2>
            </div>
            <div className="space-y-3">
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                Sortable image grid with primary image selection and upload progress bars.
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                Provider-specific location mapping required before publish for Property Finder and Bayut/Dubizzle.
              </div>
              <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
                DRE-2026-00204 blocked: missing Dubizzle community mapping.
              </div>
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center gap-2">
              <Send className="h-4 w-4 text-blue-600" />
              <h2 className="text-base font-semibold text-slate-950">Publication logic</h2>
            </div>
            <p className="text-sm text-slate-600">
              UI is separated from publish execution so provider transformations can move cleanly into Supabase Edge Functions.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
