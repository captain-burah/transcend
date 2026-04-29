create extension if not exists "pgcrypto";

create type public.app_role as enum (
  'super_admin',
  'admin',
  'manager',
  'agent',
  'listing_coordinator',
  'marketing',
  'accounts'
);

create type public.lead_temperature as enum ('hot', 'warm', 'cold');
create type public.pipeline_stage as enum (
  'new',
  'attempted_contact_1',
  'attempted_contact_2',
  'contacted',
  'qualified',
  'nurturing',
  'viewing_scheduled',
  'viewing_completed',
  'offer_made',
  'booking_form_signed',
  'tenancy_contract_pending',
  'spa_pending',
  'deal_won',
  'deal_lost',
  'cold',
  'no_response'
);
create type public.listing_status as enum (
  'draft',
  'ready_to_publish',
  'published',
  'partially_published',
  'sync_error',
  'archived'
);
create type public.portal_provider as enum ('property_finder', 'bayut', 'dubizzle');
create type public.commission_status as enum ('draft', 'pending_approval', 'approved', 'paid', 'rejected');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  avatar_url text,
  phone text,
  brokerage_team text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text,
  created_at timestamptz not null default now()
);

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  full_name text not null,
  email text,
  phone text,
  nationality text,
  notes text,
  created_at timestamptz not null default now()
);

create table public.lead_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  channel text not null,
  provider public.portal_provider,
  created_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references public.contacts(id) on delete set null,
  source_id uuid references public.lead_sources(id) on delete set null,
  assigned_to uuid references public.profiles(id) on delete set null,
  stage public.pipeline_stage not null default 'new',
  temperature public.lead_temperature not null default 'warm',
  intent text,
  budget_aed numeric(14,2),
  location_preference text,
  lead_score integer,
  next_best_action text,
  data_source text not null,
  last_activity_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index leads_stage_idx on public.leads(stage);
create index leads_assigned_to_idx on public.leads(assigned_to);
create index leads_last_activity_idx on public.leads(last_activity_at desc);

create table public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create table public.lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  activity_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_contact_id uuid references public.contacts(id) on delete set null,
  category text,
  property_type text not null,
  furnishing_type text,
  bedrooms integer,
  bathrooms numeric(4,1),
  size_sqft numeric(10,2),
  available_from date,
  emirate text not null default 'Dubai',
  community text,
  building_name text,
  unit_number text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.property_listings (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  reference_number text not null unique,
  status public.listing_status not null default 'draft',
  title_en text,
  title_ar text,
  description_en text,
  description_ar text,
  price_type text,
  price_amount_aed numeric(14,2),
  downpayment_aed numeric(14,2),
  number_of_cheques integer,
  compliance_type text,
  listing_advertisement_number text,
  project_status text,
  developer text,
  floor_number text,
  parking_slots integer,
  assigned_agent_id uuid references public.profiles(id) on delete set null,
  publish_property_finder boolean not null default false,
  publish_bayut boolean not null default false,
  publish_dubizzle boolean not null default false,
  completeness_score integer not null default 0,
  quality_score integer not null default 0,
  draft_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index property_listings_property_idx on public.property_listings(property_id);
create index property_listings_status_idx on public.property_listings(status);

create table public.property_locations (
  id uuid primary key default gen_random_uuid(),
  property_listing_id uuid not null references public.property_listings(id) on delete cascade,
  provider public.portal_provider not null,
  location_search text,
  location_id text not null,
  full_name_en text,
  raw_payload jsonb not null default '{}'::jsonb,
  unique (property_listing_id, provider)
);

create table public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_listing_id uuid not null references public.property_listings(id) on delete cascade,
  storage_path text not null,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  orientation_label text,
  compression_status text,
  created_at timestamptz not null default now()
);

create table public.property_amenities (
  property_listing_id uuid not null references public.property_listings(id) on delete cascade,
  amenity_key text not null,
  primary key (property_listing_id, amenity_key)
);

create table public.property_portal_publications (
  id uuid primary key default gen_random_uuid(),
  property_listing_id uuid not null references public.property_listings(id) on delete cascade,
  provider public.portal_provider not null,
  external_listing_id text,
  publication_status text not null,
  last_published_at timestamptz,
  last_synced_at timestamptz,
  unique (property_listing_id, provider)
);

create table public.property_sync_logs (
  id uuid primary key default gen_random_uuid(),
  property_listing_id uuid not null references public.property_listings(id) on delete cascade,
  provider public.portal_provider not null,
  action text not null,
  success boolean not null,
  request_payload jsonb,
  response_payload jsonb,
  error_message text,
  created_at timestamptz not null default now()
);

create table public.facebook_leads_raw (
  id uuid primary key default gen_random_uuid(),
  payload jsonb not null,
  webhook_signature text,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.whatsapp_conversations (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  contact_phone text not null,
  last_message_preview text,
  last_message_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.whatsapp_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.whatsapp_conversations(id) on delete cascade,
  direction text not null,
  message_type text not null,
  body text,
  provider_message_id text,
  delivery_status text,
  raw_payload jsonb,
  created_at timestamptz not null default now()
);

create table public.deals (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  property_listing_id uuid references public.property_listings(id) on delete set null,
  deal_type text not null,
  stage text not null,
  gross_value_aed numeric(14,2),
  closed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.commissions (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references public.deals(id) on delete cascade,
  beneficiary_id uuid references public.profiles(id) on delete set null,
  amount_aed numeric(14,2) not null,
  split_percent numeric(5,2),
  status public.commission_status not null default 'draft',
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  storage_path text not null,
  filename text not null,
  mime_type text,
  uploaded_by uuid references public.profiles(id) on delete set null,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.signature_requests (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references public.documents(id) on delete set null,
  provider_name text not null,
  external_envelope_id text,
  status text not null,
  callback_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.targets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  period_type text not null,
  metric_key text not null,
  target_value numeric(14,2) not null,
  starts_on date not null,
  ends_on date not null,
  created_at timestamptz not null default now()
);

create table public.automation_rules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  trigger_key text not null,
  is_active boolean not null default true,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.current_app_role()
returns public.app_role
language sql
stable
as $$
  select role
  from public.user_roles
  where user_id = auth.uid()
  order by is_primary desc, created_at asc
  limit 1
$$;

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.leads enable row level security;
alter table public.property_listings enable row level security;
alter table public.documents enable row level security;
alter table public.commissions enable row level security;

create policy "profiles are visible to authenticated users"
on public.profiles
for select
to authenticated
using (true);

create policy "users can view their own roles"
on public.user_roles
for select
to authenticated
using (user_id = auth.uid() or public.current_app_role() in ('super_admin', 'admin'));

create policy "lead access by role"
on public.leads
for select
to authenticated
using (
  public.current_app_role() in ('super_admin', 'admin', 'manager', 'marketing')
  or assigned_to = auth.uid()
);

create policy "lead mutation by privileged roles or owner"
on public.leads
for all
to authenticated
using (
  public.current_app_role() in ('super_admin', 'admin', 'manager')
  or assigned_to = auth.uid()
)
with check (
  public.current_app_role() in ('super_admin', 'admin', 'manager')
  or assigned_to = auth.uid()
);

create policy "listings readable by authenticated users"
on public.property_listings
for select
to authenticated
using (true);

create policy "listings writable by operations roles"
on public.property_listings
for all
to authenticated
using (public.current_app_role() in ('super_admin', 'admin', 'listing_coordinator', 'manager'))
with check (public.current_app_role() in ('super_admin', 'admin', 'listing_coordinator', 'manager'));

create policy "documents by role"
on public.documents
for select
to authenticated
using (
  public.current_app_role() in ('super_admin', 'admin', 'manager', 'accounts')
  or uploaded_by = auth.uid()
);

create policy "commissions by privileged or beneficiary"
on public.commissions
for select
to authenticated
using (
  public.current_app_role() in ('super_admin', 'admin', 'manager', 'accounts')
  or beneficiary_id = auth.uid()
);
