import { KeyRound, ShieldCheck, Webhook } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Settings"
        title="Security, RBAC, and integrations"
        description="Profiles, user roles, provider credentials, webhook validation, company branding, and notification preferences."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          {
            icon: ShieldCheck,
            title: "RBAC and RLS",
            text: "Profiles and user_roles tables can drive page, row, and action permissions through Supabase.",
          },
          {
            icon: Webhook,
            title: "Integrations",
            text: "Portal credentials, WABA settings, Facebook/Zapier webhooks, and digital signing provider config.",
          },
          {
            icon: KeyRound,
            title: "Audit and compliance",
            text: "Webhook signatures, signed URLs, signature event retention, and source tracking for every lead.",
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
