import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { PipelineCard } from "@/types/crm";

type KanbanBoardProps = {
  cards: PipelineCard[];
};

const stages = ["Attempted Contact 2", "Qualified", "Viewing Scheduled", "Offer Made"];

export function KanbanBoard({ cards }: KanbanBoardProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-4">
      {stages.map((stage) => {
        const stageCards = cards.filter((card) => card.stage === stage);

        return (
          <Card key={stage} className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-950">{stage}</h3>
                <p className="text-xs text-slate-500">{stageCards.length} active opportunities</p>
              </div>
              <Badge tone="default">{String(stageCards.length)}</Badge>
            </div>

            <div className="space-y-3">
              {stageCards.map((card) => (
                <div key={card.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{card.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{card.requirement}</p>
                    </div>
                    <Badge
                      tone={
                        card.priority === "High"
                          ? "danger"
                          : card.priority === "Medium"
                            ? "warning"
                            : "default"
                      }
                    >
                      {card.priority}
                    </Badge>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>{card.owner}</span>
                    <span>{card.probability}% probability</span>
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    {formatCurrency(card.budgetAed)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
