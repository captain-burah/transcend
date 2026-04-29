import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type PlaceholderPageProps = {
  title: string;
  description: string;
  badge?: string;
};

export function PlaceholderPage({
  title,
  description,
  badge = "Module Ready",
}: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <SectionHeading title={title} description={description} />
      <Card className="flex min-h-[280px] flex-col items-start justify-center gap-3">
        <Badge tone="info">{badge}</Badge>
        <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
        <p className="max-w-2xl text-sm text-slate-500">{description}</p>
      </Card>
    </div>
  );
}
