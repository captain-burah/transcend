import { KanbanBoard } from "@/components/kanban-board";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { pipelineCards } from "@/data/mock-crm";

export function PipelinePage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Pipeline"
        title="Lead lifecycle board"
        description="Drag-and-drop stage management, stage analytics, probability scoring, and agent ownership."
        action={<Button>Configure Stages</Button>}
      />

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <KanbanBoard cards={pipelineCards} />

        <Card>
          <h2 className="text-base font-semibold text-slate-950">Stage analytics</h2>
          <div className="mt-4 space-y-4">
            {[
              ["Qualified to Viewing", "62% conversion", "Above team average"],
              ["Viewing to Offer", "41% conversion", "5 opportunities at risk"],
              ["Offer to Booking", "28% conversion", "Needs manager intervention"],
            ].map(([label, value, meta]) => (
              <div key={label} className="rounded-2xl border border-slate-100 p-4">
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="mt-1 text-xl font-semibold text-slate-950">{value}</p>
                <p className="mt-1 text-sm text-slate-500">{meta}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
