import type { LucideIcon } from "lucide-react";

export type RoleKey =
  | "super_admin"
  | "admin"
  | "manager"
  | "agent"
  | "listing_coordinator"
  | "marketing"
  | "accounts";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  roles?: RoleKey[];
  badge?: string;
};

export type KPI = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "neutral";
  description: string;
};

export type LeadRecord = {
  id: string;
  name: string;
  intent: "Buyer" | "Tenant" | "Investor";
  source: string;
  stage: string;
  agent: string;
  score: number;
  budgetAed: number;
  lastActivity: string;
  temperature: "Hot" | "Warm" | "Cold";
};

export type PipelineCard = {
  id: string;
  name: string;
  requirement: string;
  stage: string;
  owner: string;
  priority: "High" | "Medium" | "Low";
  probability: number;
  budgetAed: number;
};

export type ListingRecord = {
  ref: string;
  title: string;
  community: string;
  status: "Draft" | "Ready" | "Published" | "Partial" | "Error";
  portals: string[];
  completeness: number;
  quality: number;
  assignedTo: string;
};

export type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
  category: "lead" | "listing" | "deal" | "document";
};
