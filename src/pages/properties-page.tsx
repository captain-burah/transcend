import { Building2, MapPinned, Shield } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function PropertiesPage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Property Inventory"
        title="Internal inventory and asset visibility"
        description="Owner-linked property records, availability tracking, notes, media, and compliance context."
        action={<Button>Add Property</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          {
            icon: Building2,
            title: "Inventory coverage",
            text: "1,248 internal property records with ownership, compliance, and listing linkage.",
          },
          {
            icon: MapPinned,
            title: "Location intelligence",
            text: "Community-aware mapping for Downtown, Marina, Palm, JVC, and Dubai Hills.",
          },
          {
            icon: Shield,
            title: "Compliance tracking",
            text: "Advertisement numbers, availability windows, and audit history live per property.",
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
