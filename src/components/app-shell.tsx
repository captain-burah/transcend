import { Bell, ChevronDown, Menu, MoonStar, Search, Sparkles } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { navigation, roles } from "@/data/mock-crm";
import { cn } from "@/lib/utils";
import type { RoleKey } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type AppShellProps = {
  activeRole: RoleKey;
  onRoleChange: (role: RoleKey) => void;
};

export function AppShell({ activeRole, onRoleChange }: AppShellProps) {
  const navItems = navigation.filter(
    (item) => !item.roles || item.roles.includes(activeRole),
  );

  return (
    <div className="min-h-screen bg-dashboard-glow">
      <div className="mx-auto flex min-h-screen max-w-[1720px] gap-6 px-4 py-4 lg:px-6">
        <aside className="glass-panel hidden w-72 shrink-0 rounded-[28px] border border-white/70 p-5 shadow-soft lg:flex lg:flex-col">
          <div className="mb-8 flex items-center gap-3 px-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-lg font-semibold text-white">
              DR
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Dubai Realty CRM Pro
              </p>
              <p className="text-xs text-slate-500">Brokerage Operations Cloud</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium text-slate-600 transition-colors",
                    isActive
                      ? "bg-slate-900 text-white shadow-card"
                      : "hover:bg-white hover:text-slate-900",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    {item.badge ? (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs",
                          isActive
                            ? "bg-white/15 text-white"
                            : "bg-amber-100 text-amber-700",
                        )}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl bg-slate-900 p-4 text-white shadow-card">
            <div className="mb-3 flex items-center gap-2 text-amber-300">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em]">
                AI Assist
              </span>
            </div>
            <p className="text-sm font-semibold">Next best action recommendations live</p>
            <p className="mt-2 text-sm text-slate-300">
              12 stale leads need recovery workflows. 4 listings need Arabic content review.
            </p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <header className="glass-panel sticky top-4 z-20 flex flex-col gap-4 rounded-[28px] border border-white/70 px-4 py-4 shadow-soft md:px-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 lg:hidden">
                <Menu className="h-5 w-5" />
              </button>
              <div className="relative min-w-0 flex-1 lg:w-[420px]">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-300"
                  placeholder="Search leads, listings, properties, deals..."
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <select
                className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none"
                value={activeRole}
                onChange={(event) => onRoleChange(event.target.value as RoleKey)}
              >
                {Object.entries(roles).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>

              <Button variant="outline" className="gap-2">
                <MoonStar className="h-4 w-4" />
                Theme
              </Button>
              <Button variant="outline" className="relative h-11 w-11 px-0">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500" />
              </Button>
              <Button variant="secondary" className="gap-2">
                Quick Create
                <ChevronDown className="h-4 w-4" />
              </Button>

              <div className="flex h-11 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                  RK
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-slate-900">Rashid Kareem</p>
                  <p className="text-xs text-slate-500">{roles[activeRole]}</p>
                </div>
                <Badge tone="info">Dubai HQ</Badge>
              </div>
            </div>
          </header>

          <main className="min-h-0 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
