import { Bot, Mail, MessageSquareText, Route } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function AutomationsPage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Automation Center"
        title="Event-driven workflow orchestration"
        description="Lead routing, stale lead recovery, reminders, notification flows, and provider retry automation."
        action={<Button>New Automation</Button>}
      />

      <div className="grid gap-4 xl:grid-cols-2">
        {[
          {
            icon: Route,
            title: "New portal lead assignment",
            badge: "Active",
            text: "Assigns by source + geography, notifies agent, queues AI scoring.",
          },
          {
            icon: MessageSquareText,
            title: "Viewing reminder",
            badge: "Active",
            text: "Sends WhatsApp template and email reminders 2 hours before viewing.",
          },
          {
            icon: Mail,
            title: "Stale lead follow-up",
            badge: "Needs review",
            text: "Creates task and manager escalation when no activity is logged for 24 hours.",
          },
          {
            icon: Bot,
            title: "Deal stage changed",
            badge: "Active",
            text: "Updates reports, logs audit trail, and recalculates commissions when required.",
          },
        ].map((item) => (
          <Card key={item.title}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
                <item.icon className="h-5 w-5" />
              </div>
              <Badge tone={item.badge === "Needs review" ? "warning" : "success"}>{item.badge}</Badge>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-950">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-500">{item.text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
