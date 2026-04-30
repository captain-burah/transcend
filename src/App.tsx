import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BarChart3,
  Bold,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  Edit3,
  Eye,
  Facebook,
  FileCheck2,
  Globe2,
  Handshake,
  Heading2,
  Instagram,
  Italic,
  Layers3,
  Lightbulb,
  Link2,
  LineChart,
  Linkedin,
  List,
  ListOrdered,
  Mail,
  Menu,
  MessageCircle,
  Newspaper,
  Phone,
  Plus,
  Quote,
  RefreshCw,
  Redo2,
  Save,
  ShieldCheck,
  Star,
  Target,
  Trophy,
  Trash2,
  Type,
  Underline,
  Undo2,
  Users,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Phase = {
  letter: string;
  name: string;
  weeks: string;
  summary: string;
  whatWeDo: string[];
  receive: string[];
  outcome: string;
};

type Vertical = {
  id: string;
  name: string;
  description: string;
  why: string;
  programs: string[];
  pains: string[];
  image: string;
};

type InsightArticle = {
  id: string;
  title: string;
  slug: string;
  category: string;
  readTime: string;
  publishedAt: string | null;
  excerpt: string;
  body: string;
  author: string;
  status: "draft" | "published";
  featured: boolean;
  createdAt?: string;
};

type DashboardRole = "admin" | "editor" | "viewer";

type DashboardUser = {
  id: string;
  userId: string | null;
  email: string;
  fullName: string;
  role: DashboardRole;
  status: "invited" | "active" | "disabled";
  createdAt?: string;
};

const navItems = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "ELEVATE™", href: "/elevate" },
  { label: "Verticals", href: "/verticals" },
  { label: "Insights", href: "/insights" },
];

const heroImages = {
  home: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1900&q=85",
  about: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1900&q=85",
  services: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1900&q=85",
  elevate: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1900&q=85",
  verticals: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1900&q=85",
  insights: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1900&q=85",
  contact: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1900&q=85",
};

const servicePillars = [
  {
    title: "Performance Excellence",
    subtitle: "Upscaling capabilities",
    icon: Trophy,
    copy:
      "A business strategy framework designed to build and scale impactful, high-performing organizations across sales mastery, HR excellence, customer experience, and revenue modeling.",
    bullets: ["Sales Mastery", "From pipeline to performance", "HR Excellence", "Customer Experience", "Revenue Modeling"],
    cta: "Get a Quote Now",
  },
  {
    title: "Organizational Development",
    subtitle: "Vision, mission & corporate brand strategy",
    icon: Layers3,
    copy:
      "Structured C-suite workshops that help leadership teams clarify, articulate, and embed the core identity of the organization.",
    bullets: ["Vision Statement", "Mission Statement", "Core values framework", "Brand persona & collateral", "Employer value proposition"],
    cta: "Book a Workshop",
  },
  {
    title: "Corporate Events Management",
    subtitle: "Events that inspire, align and celebrate",
    icon: CalendarDays,
    copy:
      "Precision-planned sales conferences, leadership summits, award ceremonies, launches, seminars, workshops, retreats, and recognition events.",
    bullets: ["Sales kick-offs", "Strategy retreats", "Award ceremonies", "Product launches", "Town halls and engagement programs"],
    cta: "Discuss Your Event",
  },
];

const performanceExcellencePillars = [
  {
    number: "01",
    title: "Sales Mastery",
    subtitle: "From pipeline to performance",
    icon: Target,
    copy:
      "Building elite sales cultures through structured methodology, coaching systems, and a relentless focus on conversion and growth.",
    bullets: [
      "Sales playbook design and go-to-market alignment",
      "Pipeline governance and forecast accuracy",
      "Talent hiring, onboarding, and ramp acceleration",
      "Performance coaching and accountability frameworks",
    ],
  },
  {
    number: "02",
    title: "Customer Experience",
    subtitle: "Loyalty built at every touchpoint",
    icon: Handshake,
    copy:
      "Designing end-to-end journeys that convert buyers into advocates - through consistent delivery, proactive engagement, and measurable satisfaction.",
    bullets: [
      "Customer journey mapping and experience design",
      "Voice of Customer (VoC) and NPS programs",
      "Retention, upsell, and renewal strategy",
      "Service standards and escalation handling.",
    ],
  },
  {
    number: "03",
    title: "HR Excellence",
    subtitle: "People as a competitive advantage",
    icon: Users,
    copy:
      "Attracting, developing, and retaining top talent through culture, structure, and systems that enable people to perform at their best.",
    bullets: [
      "Talent acquisition and employer brand strategy",
      "Performance management and competency frameworks",
      "Leadership development and succession planning",
      "Culture design, engagement, and retention programs.",
    ],
  },
  {
    number: "04",
    title: "Revenue Modeling",
    subtitle: "Growth that is planned, not accidental",
    icon: LineChart,
    copy:
      "Translating business ambition into financial models that guide smart resource allocation, pricing decisions, and scalable growth strategies.",
    bullets: [
      "Revenue architecture and capacity planning",
      "Pricing strategy and deal economics",
      "Sales productivity and unit economics modeling",
      "Board-ready financial storytelling and KPI dashboards",
    ],
  },
];

const coreValues = [
  {
    title: "Excellence",
    description: "We set the standard in program design, facilitation, and post-engagement support.",
  },
  {
    title: "Integrity",
    description: "Our consultants embody the principles they teach. Authentic and credible, always.",
  },
  {
    title: "Transformation",
    description: "Every intervention is designed to fundamentally shift mindsets, behaviors, and outcomes.",
  },
  {
    title: "Partnership",
    description: "Your success is our success. We invest deeply in your context, your people, your goals.",
  },
  {
    title: "Innovation",
    description: "We continuously evolve our methods to remain at the forefront of learning science.",
  },
];

const phases: Phase[] = [
  {
    letter: "E",
    name: "Evaluate",
    weeks: "Weeks 1-2",
    summary: "Deep diagnostic of sales capability, culture, and commercial performance.",
    whatWeDo: ["Sales manager interviews", "Observed call scoring against SPIN competencies", "CRM pipeline and conversion review", "Win/loss deal analysis"],
    receive: ["Sales Capability Diagnostic Report", "Maturity Scorecard", "Priority Gap Analysis"],
    outcome: "You know where your team is strong, where deals are being lost, and what to fix first with data, not guesswork.",
  },
  {
    letter: "L",
    name: "Learn",
    weeks: "Weeks 2-4",
    summary: "World-class facilitated training using your actual products, customers, and objections.",
    whatWeDo: ["2-day immersive SPIN Selling workshop", "Solution Selling methodology sessions", "Industry-specific simulations", "Individual competency assessment"],
    receive: ["Certified training completion", "Competency baseline scores", "Customized sales playbook"],
    outcome: "Your people gain a shared language and practical capability foundation before entering the field.",
  },
  {
    letter: "E",
    name: "Execute",
    weeks: "Weeks 4-8",
    summary: "Immediate field application so knowledge becomes habit before it evaporates.",
    whatWeDo: ["Weekly practice clinics", "Live call accompaniment", "Structured role-play exercises", "Individual field execution logs"],
    receive: ["Field execution log", "Observed call scorecards", "Individual practice plan"],
    outcome: "Skills move from the classroom to the sales floor in real time.",
  },
  {
    letter: "V",
    name: "Validate",
    weeks: "Weeks 8-10",
    summary: "Rigorous measurement of adoption and early performance impact.",
    whatWeDo: ["Competency re-assessment", "Pipeline quality audit", "Conversion rate comparison", "Adjusted coaching plans"],
    receive: ["Mid-point performance dashboard", "Competency progression report", "Adjusted development plans"],
    outcome: "Leaders see who is progressing, who needs support, and what the commercial data is already showing.",
  },
  {
    letter: "A",
    name: "Accelerate",
    weeks: "Weeks 10-14",
    summary: "Targeted coaching for high-potential performers and structured support for those at risk.",
    whatWeDo: ["1:1 coaching sessions", "Recovery plans for at-risk individuals", "Advanced SPIN modules", "Peer deal clinics"],
    receive: ["Individual acceleration plans", "Coaching session records", "Advanced module certificates"],
    outcome: "Top performers get better faster, and every team member gets a genuine path forward.",
  },
  {
    letter: "T",
    name: "Translate",
    weeks: "Weeks 14-18",
    summary: "Build internal coaching capability so managers can sustain transformation after we leave.",
    whatWeDo: ["Sales manager coaching certification", "Manager coaching toolkit", "Community of practice launch", "Peer coaching accountability"],
    receive: ["Certified internal coaches", "Manager coaching toolkit", "Community charter"],
    outcome: "Your managers can do what we did, making transformation self-sustaining.",
  },
  {
    letter: "E",
    name: "Embed",
    weeks: "Weeks 18-24",
    summary: "Cultural embedding through performance rituals, recognition, and review integration.",
    whatWeDo: ["Pipeline review rhythm design", "Recognition system alignment", "HR review template integration", "12-month sustainability roadmap"],
    receive: ["Performance culture playbook", "Updated HR review templates", "12-month sustainability roadmap"],
    outcome: "New behaviors become the norm, your culture rewards what matters, and results show up in the data.",
  },
];

const verticals: Vertical[] = [
  {
    id: "bfsi",
    name: "BFSI",
    description: "Banking, Financial Services & Insurance",
    why:
      "BFSI is one of the UAE's largest employers of frontline sales professionals. Regulatory complexity and needs-based selling make SPIN methodology a high-ROI investment.",
    programs: ["Bancassurance SPIN Selling training", "Insurance agent capability uplift", "Branch manager coaching", "CX enhancement matrix", "Sales conference and recognition events"],
    pains: ["Product-push behavior", "Low cross-sell and upsell conversion", "Inconsistent branch sales quality"],
    image: "https://images.unsplash.com/photo-1560472355-536de3962603?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "telecommunications",
    name: "Telecommunications",
    description: "Consumer, SME and channel sales capability",
    why:
      "Product commoditization makes customer-centric selling the only sustainable differentiator for telcos and channel partners.",
    programs: ["Postpaid and SME capability programs", "Channel partner enablement", "CX enhancement matrix", "Sales manager coaching clinics", "Annual sales kick-off management"],
    pains: ["Competing on price instead of value", "High churn", "Under-performing channel partners"],
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "real-estate",
    name: "Real Estate",
    description: "Property developers, sales teams and agency partners",
    why:
      "High-ticket consultative sales demand stronger discovery, value articulation, pipeline discipline, and partner capability.",
    programs: ["Developer sales Solution Selling program", "Agency partner workshops", "VMV and brand strategy", "Sales team structure advisory", "Property launch event management"],
    pains: ["Discount-led selling", "Commission-driven attrition", "Weak forecasting discipline"],
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "automotive",
    name: "Automotive",
    description: "Showroom, launch and customer experience teams",
    why:
      "Showroom experience and consultative selling are critical differentiators as EV disruption reshapes the sector.",
    programs: ["Showroom sales capability program", "Customer experience training", "Product launch event management"],
    pains: ["Inconsistent customer experience", "Price-led sales conversations", "Low launch momentum"],
    image: "https://images.unsplash.com/photo-1747817372958-1aadb5132208?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "technology",
    name: "Technology",
    description: "ICT, SaaS, ELV and AV",
    why:
      "Complex B2B cycles, technical buyers, and solution complexity make SPIN and Solution Selling essential for revenue growth.",
    programs: ["Complex solution sales playbooks", "Account executive SPIN program", "Pipeline discipline coaching", "Pre-sales to commercial handoff design"],
    pains: ["Technical teams struggling to build commercial cases", "Long unstructured sales cycles", "Feature-led pitching"],
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "healthcare",
    name: "Healthcare & Pharma",
    description: "Medical representatives and healthcare sales teams",
    why:
      "Consultative, science-backed selling is vital in compliance-driven healthcare environments.",
    programs: ["Medical rep capability programs", "Key account management training", "Healthcare sales manager coaching"],
    pains: ["Compliance-sensitive conversations", "Low key-account depth", "Inconsistent field coaching"],
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "fmcg",
    name: "FMCG",
    description: "Route-to-market and modern trade channel performance",
    why:
      "Route-to-market complexity and modern trade channel management require structured selling and strong manager cadence.",
    programs: ["Distributor salesforce coaching", "National sales conference management", "Channel sell-through capability"],
    pains: ["Weak distributor execution", "Modern trade pressure", "Inconsistent field routines"],
    image: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=1200&q=85",
  },
];

const defaultArticles: InsightArticle[] = [
  {
    id: "sales-training-fails",
    title: "Why 70% of sales training fails, and the one framework that changes everything",
    slug: "why-sales-training-fails",
    category: "Sales Transformation",
    readTime: "7 min read",
    publishedAt: "Apr 2026",
    excerpt:
      "A structural look at why traditional training disappears from the sales floor and how engineered journeys change outcomes.",
    body: "Every year, organizations spend heavily on sales training and see too little change on the sales floor. This article explains why event-based learning fails and how a journey-based framework changes outcomes.",
    author: "Transcend Consultancy",
    status: "published",
    featured: true,
  },
  {
    id: "consultant-not-speaker",
    title: "7 signs your sales team needs a consultant, not another motivational speaker",
    slug: "consultant-not-motivational-speaker",
    category: "Sales Leadership",
    readTime: "5 min read",
    publishedAt: "Apr 2026",
    excerpt: "Motivation fades by Monday. Capability compounds for years. Here is how to tell which problem you actually have.",
    body: "Motivation has a place, but persistent sales performance gaps usually need structure, coaching, and measurable capability building.",
    author: "Transcend Consultancy",
    status: "published",
    featured: false,
  },
  {
    id: "spin-question",
    title: "The single question SPIN Selling teaches you to never ask a prospect",
    slug: "spin-selling-question-never-ask",
    category: "SPIN Selling",
    readTime: "4 min read",
    publishedAt: "Apr 2026",
    excerpt: "Most salespeople open with the one question that kills trust before the conversation has even started.",
    body: "SPIN Selling changes the quality of discovery by helping sellers move from shallow questioning to structured buyer understanding.",
    author: "Transcend Consultancy",
    status: "published",
    featured: false,
  },
  {
    id: "build-sales-team",
    title: "How to build a sales team from scratch, what nobody tells you",
    slug: "build-sales-team-from-scratch",
    category: "Team Building",
    readTime: "6 min read",
    publishedAt: "Apr 2026",
    excerpt: "The honest version from commercial functions built across two countries and multiple market cycles.",
    body: "Building a sales team from scratch requires more than hiring. It needs role clarity, manager cadence, onboarding, pipeline discipline, and coaching systems.",
    author: "Transcend Consultancy",
    status: "published",
    featured: false,
  },
];

const localArticlesKey = "transcend-insight-articles";
const localDashboardUsersKey = "transcend-dashboard-users";

const roleLabels: Record<DashboardRole, string> = {
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
};

const roleDescriptions: Record<DashboardRole, string> = {
  admin: "Full dashboard access, user management, and publishing control.",
  editor: "Create, edit, publish, duplicate, and delete Insights articles.",
  viewer: "Read-only access to the dashboard and article library.",
};

function articleMeta(article: InsightArticle) {
  return `${article.category} · ${article.readTime} · ${formatArticleDate(article.publishedAt)}`;
}

function formatArticleDate(value: string | null) {
  if (!value) return "Draft";
  if (/^[A-Z][a-z]{2}\s\d{4}$/.test(value)) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en", { month: "short", year: "numeric" });
}

function createArticleSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeArticle(row: Record<string, unknown>): InsightArticle {
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    slug: String(row.slug ?? createArticleSlug(String(row.title ?? ""))),
    category: String(row.category ?? "Insights"),
    readTime: String(row.read_time ?? row.readTime ?? "5 min read"),
    publishedAt: row.published_at || row.publishedAt ? String(row.published_at ?? row.publishedAt) : null,
    excerpt: String(row.excerpt ?? ""),
    body: String(row.body ?? ""),
    author: String(row.author ?? "Transcend Consultancy"),
    status: (row.status === "draft" ? "draft" : "published") as "draft" | "published",
    featured: Boolean(row.featured ?? row.is_featured ?? row.isFeatured),
    createdAt: row.created_at ? String(row.created_at) : undefined,
  };
}

function normalizeDashboardUser(row: Record<string, unknown>): DashboardUser {
  const role = row.role === "admin" || row.role === "editor" || row.role === "viewer" ? row.role : "viewer";
  const status = row.status === "active" || row.status === "disabled" || row.status === "invited" ? row.status : "invited";

  return {
    id: String(row.id ?? crypto.randomUUID()),
    userId: row.user_id || row.userId ? String(row.user_id ?? row.userId) : null,
    email: String(row.email ?? ""),
    fullName: String(row.full_name ?? row.fullName ?? ""),
    role,
    status,
    createdAt: row.created_at ? String(row.created_at) : undefined,
  };
}

function readLocalArticles() {
  try {
    const stored = window.localStorage.getItem(localArticlesKey);
    return stored ? (JSON.parse(stored) as Record<string, unknown>[]).map(normalizeArticle) : defaultArticles;
  } catch {
    return defaultArticles;
  }
}

function saveLocalArticles(articles: InsightArticle[]) {
  window.localStorage.setItem(localArticlesKey, JSON.stringify(articles));
}

function readLocalDashboardUsers(currentEmail = "local.admin@transcend.local") {
  try {
    const stored = window.localStorage.getItem(localDashboardUsersKey);
    if (stored) return (JSON.parse(stored) as Record<string, unknown>[]).map(normalizeDashboardUser);
  } catch {
    // fall through to seeded local admin
  }

  return [
    {
      id: "local-admin",
      userId: null,
      email: currentEmail,
      fullName: "Local Admin",
      role: "admin" as DashboardRole,
      status: "active" as const,
    },
  ];
}

function saveLocalDashboardUsers(users: DashboardUser[]) {
  window.localStorage.setItem(localDashboardUsersKey, JSON.stringify(users));
}

function usePublishedInsights() {
  const [articles, setArticles] = useState<InsightArticle[]>(defaultArticles);

  useEffect(() => {
    async function loadArticles() {
      if (!supabase) {
        setArticles(readLocalArticles().filter((article) => article.status === "published"));
        return;
      }

      const { data, error } = await supabase
        .from("insights_articles")
        .select("id,title,slug,category,read_time,published_at,excerpt,body,author,status,featured,created_at")
        .eq("status", "published")
        .order("featured", { ascending: false })
        .order("published_at", { ascending: false });

      if (error || !data?.length) {
        setArticles(defaultArticles);
        return;
      }

      setArticles(data.map(normalizeArticle));
    }

    loadArticles();
  }, []);

  return articles;
}

function Logo() {
  return (
    <Link className="block" to="/" aria-label="Transcend Consultancy home">
      <img
        alt="Transcend Consultancy"
        className="h-14 w-auto max-w-[230px] object-contain md:h-16 md:max-w-[300px]"
        src="/brand/transcend-logo-blue.png"
      />
    </Link>
  );
}

function Gold({ children }: { children: ReactNode }) {
  return <span className="brand-gold">{children}</span>;
}

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy shadow-lg shadow-navy/15">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Logo />
        <div className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `font-heading text-sm font-semibold transition ${
                  isActive ? "brand-gold" : "brand-muted hover:!text-white"
                }`
              }
              key={item.href}
              to={item.href}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        <Link className="gold-button hidden lg:inline-flex" to="/contact#contact-form">
          Contact Us
        </Link>
        <button
          aria-label="Toggle navigation"
          className="grid h-11 w-11 place-items-center rounded-lg border border-white/20 text-white lg:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-white/10 bg-navy px-5 pb-5 lg:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                className="brand-muted rounded-md px-3 py-3 font-heading text-sm font-semibold hover:bg-white/10 hover:!text-white"
                key={item.href}
                onClick={() => setOpen(false)}
                to={item.href}
              >
                {item.label}
              </NavLink>
            ))}
            <Link className="gold-button mt-2 justify-center" onClick={() => setOpen(false)} to="/contact#contact-form">
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function PageHero({
  eyebrow,
  title,
  body,
  image,
  cta,
}: {
  eyebrow: string;
  title: ReactNode;
  body: string;
  image: string;
  cta?: ReactNode;
}) {
  return (
    <section
      className="relative overflow-hidden bg-navy"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(26, 60, 110, .92), rgba(26, 60, 110, .76)), url(${image})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-5 py-20 lg:px-8">
        <p className="brand-gold font-heading text-sm font-bold uppercase tracking-[0.32em]">{eyebrow}</p>
        <h1 className="brand-white mt-5 max-w-5xl font-heading text-4xl font-bold leading-tight md:text-6xl">
          {title}
        </h1>
        <p className="brand-muted mt-6 max-w-3xl text-lg leading-8">{body}</p>
        {cta && <div className="mt-8">{cta}</div>}
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, body }: { eyebrow: string; title: ReactNode; body?: string }) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <p className="brand-gold font-heading text-sm font-bold uppercase tracking-[0.3em]">{eyebrow}</p>
      <h2 className="brand-white mt-4 font-heading text-3xl font-bold leading-tight md:text-5xl">{title}</h2>
      {body && <p className="brand-muted mt-5 text-base leading-7 md:text-lg">{body}</p>}
    </div>
  );
}

function Panel({
  children,
  className = "",
  id,
  strong = false,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  strong?: boolean;
}) {
  return <div className={`${strong ? "brand-panel-strong" : "brand-panel"} rounded-lg ${className}`} id={id}>{children}</div>;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-3">
      {items.map((item) => (
        <li className="brand-muted flex gap-3 text-sm leading-6" key={item}>
          <CheckCircle2 className="brand-gold mt-0.5 shrink-0" size={18} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function IconStat({ icon: Icon, title, copy }: { icon: LucideIcon; title: string; copy: string }) {
  return (
    <Panel className="p-6">
      <Icon className="brand-gold" size={28} />
      <h3 className="brand-white mt-4 font-heading text-xl font-bold">{title}</h3>
      <p className="brand-muted mt-3 text-sm leading-6">{copy}</p>
    </Panel>
  );
}

function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const plainText = value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = plainText ? plainText.split(" ").length : 0;
  const fontFamilies = ["Open Sans", "Montserrat", "Arial", "Georgia", "Times New Roman"];
  const fontSizes = [
    { label: "Small", value: "2" },
    { label: "Normal", value: "3" },
    { label: "Large", value: "5" },
    { label: "XL", value: "6" },
  ];

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || document.activeElement === editor || editor.innerHTML === value) return;
    editor.innerHTML = value;
  }, [value]);

  function runCommand(command: string, commandValue?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    onChange(editorRef.current?.innerHTML ?? "");
  }

  function insertLink() {
    const selectedText = window.getSelection()?.toString().trim();
    const text = selectedText || window.prompt("Link text");
    if (!text) return;
    if (!selectedText) runCommand("insertText", text);

    const url = window.prompt("Enter the URL", "https://");
    if (!url) return;
    const normalizedUrl = /^https?:\/\//i.test(url) || url.startsWith("mailto:") ? url : `https://${url}`;
    runCommand("createLink", normalizedUrl);
  }

  const toolbarGroups: Array<Array<{ label: string; command: string; icon: LucideIcon; value?: string }>> = [
    [
      { label: "Bold", command: "bold", icon: Bold },
      { label: "Italic", command: "italic", icon: Italic },
      { label: "Underline", command: "underline", icon: Underline },
    ],
    [
      { label: "Bulleted list", command: "insertUnorderedList", icon: List },
      { label: "Numbered list", command: "insertOrderedList", icon: ListOrdered },
    ],
    [
      { label: "Undo", command: "undo", icon: Undo2 },
      { label: "Redo", command: "redo", icon: Redo2 },
    ],
  ];

  return (
    <div className="mt-2 overflow-hidden rounded-2xl border border-white/15 bg-[#071C35] shadow-inner shadow-black/20">
      <div className="border-b border-white/10 bg-[#F8FAFC] px-3 py-2 text-[#1F2937]">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
            <select
              aria-label="Text style"
              className="h-8 rounded-md border border-transparent bg-white px-2 text-xs font-bold text-slate-700 outline-none transition hover:bg-slate-100 focus:border-slate-300"
              onChange={(event) => {
                runCommand("formatBlock", event.target.value);
                event.currentTarget.value = "p";
              }}
              title="Text style"
              value="p"
            >
              <option value="p">Paragraph</option>
              <option value="h2">Heading</option>
              <option value="blockquote">Quote</option>
            </select>
            <select
              aria-label="Font family"
              className="h-8 max-w-36 rounded-md border border-transparent bg-white px-2 text-xs font-bold text-slate-700 outline-none transition hover:bg-slate-100 focus:border-slate-300"
              defaultValue=""
              onChange={(event) => {
                runCommand("fontName", event.target.value);
                event.currentTarget.value = "";
              }}
              title="Font family"
            >
              <option value="" disabled>Font</option>
              {fontFamilies.map((font) => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
            <select
              aria-label="Font size"
              className="h-8 rounded-md border border-transparent bg-white px-2 text-xs font-bold text-slate-700 outline-none transition hover:bg-slate-100 focus:border-slate-300"
              defaultValue=""
              onChange={(event) => {
                runCommand("fontSize", event.target.value);
                event.currentTarget.value = "";
              }}
              title="Font size"
            >
              <option value="" disabled>Size</option>
              {fontSizes.map((size) => (
                <option key={size.value} value={size.value}>{size.label}</option>
              ))}
            </select>
            <label className="flex h-8 items-center gap-2 rounded-md px-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100" title="Font color">
              Color
              <input
                aria-label="Font color"
                className="h-5 w-7 cursor-pointer border-0 bg-transparent p-0"
                defaultValue="#1f2937"
                onChange={(event) => runCommand("foreColor", event.target.value)}
                type="color"
              />
            </label>
          </div>
          {toolbarGroups.map((group, groupIndex) => (
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm" key={groupIndex}>
              {group.map(({ label, command, icon: Icon, value: commandValue }) => (
                <button
                  aria-label={label}
                  className="grid h-8 min-w-8 place-items-center rounded-md px-2 text-slate-700 transition hover:bg-slate-100"
                  key={label}
                  onClick={() => runCommand(command, commandValue)}
                  title={label}
                  type="button"
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          ))}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
            <button
              aria-label="Insert link"
              className="grid h-8 min-w-8 place-items-center rounded-md px-2 text-slate-700 transition hover:bg-slate-100"
              onClick={insertLink}
              title="Insert link"
              type="button"
            >
              <Link2 size={16} />
            </button>
            <button
              className="h-8 rounded-md px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
              onClick={() => runCommand("removeFormat")}
              type="button"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
      <div
        className="rich-editor min-h-[360px] bg-white px-6 py-5 text-[15px] leading-8 text-slate-800 outline-none"
        contentEditable
        onInput={(event) => onChange(event.currentTarget.innerHTML)}
        ref={editorRef}
        role="textbox"
        suppressContentEditableWarning
      />
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-[#F8FAFC] px-4 py-2 text-xs font-semibold text-slate-500">
        <span>Rich text editor</span>
        <span>{wordCount} words</span>
      </div>
    </div>
  );
}

function CTA({
  title = <>Ready to <Gold>transform?</Gold></>,
  body = "Let's start with a focused 30-minute conversation. No pitch deck. No hard sell. Just clarity on the challenge and what is possible.",
}: {
  title?: ReactNode;
  body?: string;
}) {
  return (
    <section className="brand-navy-alt px-5 py-16 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div>
          <p className="brand-gold font-heading text-sm font-bold uppercase tracking-[0.3em]">Contact Us</p>
          <h2 className="brand-white mt-3 max-w-3xl font-heading text-3xl font-bold md:text-5xl">{title}</h2>
          <p className="brand-muted mt-4 max-w-2xl leading-7">{body}</p>
        </div>
        <Link className="gold-button" to="/contact#contact-form">
          Book My Discovery Call <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}

function HomePage() {
  const [activePhase, setActivePhase] = useState(0);

  return (
    <>
      <PageHero
        eyebrow="UAE's Premier Business Transformation Partner"
        title={
          <>
            Stop Training Your Teams. <Gold>Start Transforming Them.</Gold>
          </>
        }
        body="UAE based with a global focus. Built on 25+ years of frontline corporate experience, delivering measurable ROI, not just certificates."
        image={heroImages.home}
        cta={
          <div>
            <p className="brand-white font-heading text-2xl font-bold leading-snug md:text-3xl">
              Elevate <Gold>People.</Gold> Transform <Gold>Performance.</Gold> Transcend <Gold>Limits.</Gold>
            </p>
            <div className="mt-7 flex flex-wrap gap-4">
              <Link className="gold-button" to="/contact#contact-form">
                Contact Us <ArrowRight size={18} />
              </Link>
              <Link className="ghost-button" to="/elevate">
                See How It Works
              </Link>
            </div>
          </div>
        }
      />
      <section className="brand-navy px-5 py-20 lg:px-8">
        <SectionHeader
          eyebrow="What We Do"
          title={
            <>
              Three Service Pillars. <Gold>One Measurable Commitment.</Gold>
            </>
          }
          body="Every service is customized, measured, and backed by our results-first operating philosophy."
        />
        <div className="mx-auto mt-12 grid max-w-7xl gap-5 lg:grid-cols-3">
          {servicePillars.map(({ title, subtitle, icon: Icon, copy }) => (
            <Panel className="p-7" key={title}>
              <Icon className="brand-gold" size={32} />
              <p className="brand-gold mt-5 font-heading text-xs font-bold uppercase tracking-[0.24em]">{subtitle}</p>
              <h3 className="brand-white mt-3 font-heading text-2xl font-bold">{title}</h3>
              <p className="brand-muted mt-4 text-sm leading-6">{copy}</p>
              <Link className="brand-gold mt-6 inline-flex items-center gap-2 font-heading text-sm font-bold" to="/services">
                Learn More <ChevronRight size={17} />
              </Link>
            </Panel>
          ))}
        </div>
      </section>
      <section className="brand-navy-alt px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <p className="brand-gold font-heading text-sm font-bold uppercase tracking-[0.3em]">
              Our Proprietary Methodology
            </p>
            <h2 className="brand-white mt-4 font-heading text-4xl font-bold leading-tight">
              The <Gold>ELEVATE™</Gold> Framework
            </h2>
            <p className="brand-muted mt-5 leading-7">
              70% of coaching fails within 30 days. ELEVATE™ was engineered to be the 30%: a 7-phase transformation journey with a measurable results guarantee built in.
            </p>
            <div className="mt-7 rounded-lg border border-gold/30 p-5">
              <p className="brand-white font-heading text-2xl font-bold">20% - 35%</p>
              <p className="brand-muted mt-2 text-sm leading-6">
                Improvement in pipeline conversion, deal size, and time-to-quota within 6 months for full-program clients.
              </p>
            </div>
          </div>
          <Panel className="p-6" strong>
            <div className="grid grid-cols-7 gap-2">
              {phases.map((phase, index) => (
                <button
                  className={`phase-letter ${activePhase === index ? "phase-letter-active" : ""}`}
                  key={`${phase.name}-${index}`}
                  onClick={() => setActivePhase(index)}
                  type="button"
                >
                  {phase.letter}
                </button>
              ))}
            </div>
            <div className="mt-6">
              <p className="brand-gold font-heading text-sm font-bold uppercase tracking-[0.22em]">
                {phases[activePhase].weeks}
              </p>
              <h3 className="brand-white mt-2 font-heading text-3xl font-bold">{phases[activePhase].name}</h3>
              <p className="brand-muted mt-3 leading-7">{phases[activePhase].summary}</p>
            </div>
            <Link className="gold-button mt-7" to="/elevate">
              Explore ELEVATE <ArrowRight size={18} />
            </Link>
          </Panel>
        </div>
      </section>
      <section className="brand-navy px-5 py-20 lg:px-8">
        <SectionHeader
          eyebrow="Built For UAE's High Performing Sectors"
          title={
            <>
              We speak your <Gold>industry's language.</Gold>
            </>
          }
        />
        <div className="mx-auto mt-10 flex max-w-6xl flex-wrap justify-center gap-3">
          {verticals.map((vertical) => (
            <Link className="sector-pill" key={vertical.id} to={`/verticals#${vertical.id}`}>
              {vertical.name}
            </Link>
          ))}
        </div>
      </section>
      <section className="brand-navy-alt px-5 py-20 lg:px-8">
        <SectionHeader eyebrow="Why Organizations Choose Us" title={<>The Transcend <Gold>Difference</Gold></>} />
        <div className="mx-auto mt-12 grid max-w-7xl gap-5 md:grid-cols-3">
          <IconStat icon={BriefcaseBusiness} title="Real-world credibility" copy="Our consultants have closed AED 25M+ enterprise deals themselves. We teach what we have lived." />
          <IconStat icon={Globe2} title="UAE-built for UAE" copy="Every program reflects UAE buyer culture, commercial dynamics, and regional execution realities." />
          <IconStat icon={ShieldCheck} title="Results guaranteed" copy="ELEVATE™ engagements are tied to measurable outcome commitments, not certificates." />
        </div>
        <Panel className="mx-auto mt-10 max-w-4xl p-8 text-center" strong>
          <Quote className="brand-gold mx-auto" size={34} />
          <p className="brand-white mt-5 font-heading text-2xl font-bold leading-snug">
            We don't train your people. <Gold>We architect your future performance.</Gold>
          </p>
          <p className="brand-muted mt-4">Renil Nalawangsa · Founding Consultant · 25+ years UAE corporate leadership</p>
        </Panel>
      </section>
      <CTA />
    </>
  );
}

function AboutPage() {
  const [activeValue, setActiveValue] = useState<string | null>(null);
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);

  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={
          <>
            We built the firm we <Gold>always wished existed.</Gold>
          </>
        }
        body="Transcend Consultancy was created after 25 years of watching training budgets disappear with too little business impact. We fix that permanently."
        image={heroImages.about}
        cta={<Link className="gold-button" to="/contact#contact-form">Work With Us <ArrowRight size={18} /></Link>}
      />
      <section className="brand-navy px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
          <div>
            <p className="brand-gold font-heading text-sm font-bold uppercase tracking-[0.3em]">Our Story</p>
            <h2 className="brand-white mt-4 font-heading text-4xl font-bold leading-tight">
              Training was being delivered as events. <Gold>We made it a journey.</Gold>
            </h2>
          </div>
          <div className="brand-muted space-y-5 leading-8">
            <p>After 25 years of closing multimillion-dirham deals, building sales teams from scratch, and watching corporate training budgets disappear with nothing to show for them, the question became unavoidable: why does so much training fail so completely?</p>
            <p>The answer was not a mystery. Training was being delivered as events, not journeys. As certificates, not capability. As a cost, not an investment.</p>
            <p>Transcend Consultancy is built to fix that with practical, measurable, field-tested transformation.</p>
          </div>
        </div>
      </section>
      <section className="brand-navy-alt px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <Panel className="p-8" strong>
            <p className="brand-gold font-heading text-sm font-bold uppercase tracking-[0.3em]">Founding Consultant</p>
            <h2 className="brand-white mt-4 font-heading text-4xl font-bold">Renil Nalawangsa</h2>
            <p className="brand-muted mt-5 leading-8">
              Renil began his commercial career in 1997 managing Toshiba PBX systems business for John Keells Office Automation in Sri Lanka. Across Sri Lanka and the UAE, he built enterprise sales functions, retention strategies, and high-value commercial outcomes in technology and digital transformation.
            </p>
            <p className="brand-muted mt-5 leading-8">
              At Al Futtaim Panatech, he held full P&L responsibility, delivered consistent revenue growth, and led teams through landmark AED 20M and AED 27M deals. At Pixcom Technologies, he anchored an AED 25M+ IoT enterprise contract and built GTM strategy across the UAE.
            </p>
            <p className="brand-white mt-6 border-l-2 border-gold pl-5 font-semibold italic leading-7">
              I spent 25 years inside the commercial trenches. I did not start Transcend Consultancy to teach theory. I started it to give organizations what I had to figure out the hard way.
            </p>
          </Panel>
          <Panel className="p-8">
            <Award className="brand-gold" size={36} />
            <h3 className="brand-white mt-5 font-heading text-2xl font-bold">MBA · Postgraduate Institute of Management</h3>
            <p className="brand-muted mt-4 leading-7">University of Sri Jayewardenepura, Sri Lanka</p>
            <div className="mt-8 grid gap-4">
              {["25+ years frontline commercial leadership", "Enterprise deal experience", "UAE technology and transformation expertise"].map((item) => (
                <div className="brand-white flex gap-3" key={item}>
                  <BadgeCheck className="brand-gold shrink-0" size={20} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </section>
      <section className="brand-navy px-5 py-20 lg:px-8">
        <SectionHeader
          eyebrow="What We Stand For"
          title={
            <>
              Vision, mission & the <Gold>promise behind every engagement.</Gold>
            </>
          }
        />
        <div className="mx-auto mt-12 grid max-w-7xl gap-5 lg:grid-cols-2">
          <Panel className="p-7">
            <h3 className="brand-white font-heading text-2xl font-bold">Our Vision</h3>
            <p className="brand-muted mt-4 leading-7">To be the most trusted catalyst for performance excellence and organizational transformation, creating a world where every professional achieves their fullest commercial potential.</p>
          </Panel>
          <Panel className="p-7">
            <h3 className="brand-white font-heading text-2xl font-bold">Our Mission</h3>
            <p className="brand-muted mt-4 leading-7">We partner with organizations to unlock human potential, build world-class capabilities, and foster cultures of sustained high performance, delivering measurable commercial results in every engagement.</p>
          </Panel>
        </div>
        <div className="mx-auto mt-5 grid max-w-7xl gap-5 md:grid-cols-5">
          {coreValues.map(({ title, description }) => {
            const isOpen = activeValue === title || hoveredValue === title;

            return (
              <button
                aria-expanded={isOpen}
                aria-label={`${title}: ${description}`}
                className={`brand-panel min-h-24 rounded-lg p-5 text-center transition duration-200 hover:-translate-y-1 hover:border-[#C9952A] hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#C9952A]/45 ${isOpen ? "border-[#C9952A] bg-white/10" : ""}`}
                key={title}
                onBlur={() => setHoveredValue(null)}
                onClick={() => setActiveValue((current) => (current === title ? null : title))}
                onFocus={() => setHoveredValue(title)}
                onMouseEnter={() => setHoveredValue(title)}
                onMouseLeave={() => setHoveredValue(null)}
                type="button"
              >
                <h3 className="brand-gold font-heading text-lg font-bold">{title}</h3>
                <p
                  className={`brand-muted overflow-hidden text-sm leading-6 transition-all duration-200 ${isOpen ? "mt-3 max-h-48 opacity-100" : "mt-0 max-h-0 opacity-0"}`}
                >
                  {description}
                </p>
              </button>
            );
          })}
        </div>
        <Panel className="mx-auto mt-12 max-w-5xl p-8 text-center md:p-10" strong>
          <p className="brand-gold font-heading text-sm font-bold uppercase tracking-[0.3em]">Our Brand Promise</p>
          <Quote className="brand-gold mx-auto mt-6" size={34} />
          <p className="brand-white mx-auto mt-5 max-w-4xl font-heading text-2xl font-bold leading-snug md:text-3xl">
            We don't just coach your people; <Gold>we architect your future performance.</Gold> Every engagement is a <Gold>transformation, not a transaction.</Gold>
          </p>
          <p className="brand-muted mt-5">- Founding Consultant, Transcend TCG -</p>
        </Panel>
      </section>
      <CTA title={<>Work with <Gold>Transcend.</Gold></>} />
    </>
  );
}

function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title={
          <>
            Performance solutions built around <Gold>your business</Gold>
          </>
        }
        body="Every engagement is customized to your industry, your team, and your commercial context, then measured against real business outcomes. Not attendance sheets."
        image={heroImages.services}
      />
      <section className="brand-navy px-5 py-20 lg:px-8" id="performance-excellence">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[.88fr_1.12fr] lg:items-end">
            <div>
              <p className="brand-gold font-heading text-sm font-bold uppercase tracking-[0.3em]">
                Upscaling Capabilities
              </p>
              <h2 className="brand-white mt-4 font-heading text-4xl font-bold leading-tight md:text-5xl">
                Performance Excellence
              </h2>
              <p className="brand-muted mt-5 text-lg leading-8">
                This is a business strategy framework designed to build and scale impactful, high-performing organizations. It operates across four interconnected pillars, each reinforcing the other to drive sustainable growth, exceptional customer outcomes, and measurable revenue impact.
              </p>
            </div>
            <Panel className="p-7" strong>
              <Trophy className="brand-gold" size={38} />
              <h3 className="brand-white mt-5 font-heading text-2xl font-bold">The four pillars work as a system</h3>
              <p className="brand-muted mt-4 leading-7">
                Performance Excellence works best when the four areas support each other. Sales teams need strong people systems, customer experience needs clear revenue insight, and growth plans need practical numbers behind them.
              </p>
              <Link className="gold-button mt-6" to="/contact#contact-form">
                Get a Quote Now <ArrowRight size={18} />
              </Link>
            </Panel>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {performanceExcellencePillars.map(({ number, title, subtitle, icon: Icon, copy, bullets }) => (
              <Panel className="group overflow-hidden p-6 md:p-7" key={title}>
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="brand-gold font-heading text-xs font-bold uppercase tracking-[0.24em]">
                      {number} · {title}
                    </p>
                    <h3 className="brand-white mt-3 font-heading text-2xl font-bold">{subtitle}</h3>
                  </div>
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-gold/30 bg-gold/10">
                    <Icon className="brand-gold" size={25} />
                  </div>
                </div>
                <p className="brand-muted mt-5 leading-7">{copy}</p>
                <BulletList items={bullets} />
              </Panel>
            ))}
          </div>

          <Panel className="mt-8 grid gap-6 p-7 lg:grid-cols-[.75fr_1.25fr]" strong>
            <div>
              <p className="brand-gold font-heading text-sm font-bold uppercase tracking-[0.28em]">Leadership Outcome</p>
              <h3 className="brand-white mt-3 font-heading text-3xl font-bold">Move from reactive management to deliberate, scalable excellence.</h3>
            </div>
            <p className="brand-muted leading-8">
              This framework is built for organizations that want to move from reactive management to deliberate, scalable excellence - giving leadership teams the strategy, tools, and talent architecture to compete at the highest level.
            </p>
          </Panel>
        </div>
      </section>

      <section className="brand-navy-alt px-5 py-20 lg:px-8">
        <SectionHeader
          eyebrow="Additional Capabilities"
          title={
            <>
              Great organizations are built on <Gold>great foundations.</Gold>
            </>
          }
          body="Transcend Consultancy facilitates strategic brand-identity workshops that help leadership teams clarify, articulate, and embed the core foundations of their organization."
        />
        <div className="mx-auto mt-12 grid max-w-7xl gap-6 lg:grid-cols-2">
          <Panel className="p-7" strong>
            <Layers3 className="brand-gold" size={36} />
            <p className="brand-gold mt-5 font-heading text-xs font-bold uppercase tracking-[0.26em]">
              Vision, Mission, Values & Brand Persona
            </p>
            <h3 className="brand-white mt-3 font-heading text-3xl font-bold">Organizational Development</h3>
            <p className="brand-muted mt-4 leading-7">
              Great organizations are built on great foundations. Transcend Consultancy facilitates strategic brand-identity workshops that help leadership teams clarify, articulate, and embed the core foundations of their organization. Our VMV process produces:
            </p>
            <BulletList
              items={[
                "A compelling, authentic Vision Statement that galvanises teams and attracts talent",
                "A Mission Statement that defines your unique value to customers and stakeholders",
                "A Core Values framework that guides decisions and shapes culture",
                "A distinct Brand Persona that differentiates you in your market",
                "An Employer Value Proposition (EVP) aligned to your talent strategy",
              ]}
            />
            <Link className="gold-button mt-7" to="/contact#contact-form">
              Book a Workshop <ArrowRight size={18} />
            </Link>
          </Panel>

          <Panel className="p-7">
            <CalendarDays className="brand-gold" size={36} />
            <p className="brand-gold mt-5 font-heading text-xs font-bold uppercase tracking-[0.26em]">
              Events That Inspire, Align And Celebrate
            </p>
            <h3 className="brand-white mt-3 font-heading text-3xl font-bold">Corporate Events Management</h3>
            <p className="brand-muted mt-4 leading-7">
              Transcend Consultancy brings the same precision and energy to events that we bring to training. We design and execute impactful corporate events that inspire, align, and celebrate. Our events capability covers:
            </p>
            <BulletList
              items={[
                "Annual sales conferences and kick-off events",
                "Leadership summits and strategy retreats",
                "Seminars & Workshops",
                "Team-building and engagement programs",
                "Award ceremonies and recognition events",
                "Product launches and client appreciation events",
                "Town halls and all-hands meetings",
              ]}
            />
            <Link className="gold-button mt-7" to="/contact#contact-form">
              Discuss Your Event <ArrowRight size={18} />
            </Link>
          </Panel>
        </div>
      </section>
      <CTA title={<>Not sure where to start? <Gold>Diagnose the challenge first.</Gold></>} body="Tell us what is not working. We will recommend the right service, and if we are not the right fit, we will tell you that too." />
    </>
  );
}

function ElevatePage() {
  const [activePhase, setActivePhase] = useState(0);
  const phase = phases[activePhase];

  return (
    <>
      <PageHero
        eyebrow="Proprietary Methodology · Patent Pending"
        title={
          <>
            The <Gold>ELEVATE™</Gold> Framework
          </>
        }
        body="A 24-week sales transformation journey built around seven phases, clear milestones, measured outcomes, and a results guarantee from day one."
        image={heroImages.elevate}
      />
      <section className="brand-navy px-5 py-20 lg:px-8">
        <SectionHeader
          eyebrow="Interactive Phase Explorer"
          title={
            <>
              Click any phase to explore <Gold>what happens and what you receive.</Gold>
            </>
          }
        />
        <div className="mx-auto mt-12 grid max-w-7xl gap-8 lg:grid-cols-[.55fr_1.45fr]">
          <Panel className="p-5">
            <div className="grid grid-cols-7 gap-2 lg:grid-cols-1">
              {phases.map((item, index) => (
                <button
                  className={`phase-tab ${activePhase === index ? "phase-tab-active" : ""}`}
                  key={`${item.name}-tab`}
                  onClick={() => setActivePhase(index)}
                  type="button"
                >
                  <span>{item.letter}</span>
                  <strong>{item.name}</strong>
                </button>
              ))}
            </div>
          </Panel>
          <Panel className="p-7" strong>
            <p className="brand-gold font-heading text-sm font-bold uppercase tracking-[0.24em]">
              Phase {activePhase + 1} of 7 · {phase.weeks}
            </p>
            <h2 className="brand-white mt-3 font-heading text-4xl font-bold">{phase.name}</h2>
            <p className="brand-muted mt-4 text-lg leading-8">{phase.summary}</p>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="brand-white font-heading text-xl font-bold">What we do</h3>
                <BulletList items={phase.whatWeDo} />
              </div>
              <div>
                <h3 className="brand-white font-heading text-xl font-bold">What you receive</h3>
                <BulletList items={phase.receive} />
              </div>
            </div>
            <div className="mt-8 rounded-lg border border-gold/30 bg-white/5 p-5">
              <p className="brand-gold font-heading text-sm font-bold uppercase tracking-[0.2em]">Phase Outcome</p>
              <p className="brand-white mt-3 text-lg leading-8">{phase.outcome}</p>
            </div>
          </Panel>
        </div>
      </section>
      <section className="brand-navy-alt px-5 py-20 lg:px-8">
        <SectionHeader eyebrow="Full Program Timeline" title={<>24 weeks from diagnosis to <Gold>cultural embedding.</Gold></>} />
        <div className="mx-auto mt-12 grid max-w-7xl gap-4 md:grid-cols-7">
          {phases.map((item) => (
            <Panel className="p-5 text-center" key={`${item.name}-timeline`}>
              <div className="brand-gold font-heading text-4xl font-bold">{item.letter}</div>
              <h3 className="brand-white mt-3 font-heading text-lg font-bold">{item.name}</h3>
              <p className="brand-muted mt-2 text-xs">{item.weeks}</p>
            </Panel>
          ))}
        </div>
        <div className="mx-auto mt-10 grid max-w-7xl gap-5 md:grid-cols-3">
          <IconStat icon={FileCheck2} title="Month 1-2" copy="Diagnosis complete, full capability gap report delivered, and coaching content customized." />
          <IconStat icon={LineChart} title="Month 3-4" copy="First measurable shifts in pipeline quality, conversation depth, and conversion rates." />
          <IconStat icon={Trophy} title="Month 6" copy="20-35% improvement in agreed metrics, certified internal coaches, and self-sustaining culture." />
        </div>
      </section>
      <section className="brand-navy px-5 py-20 lg:px-8">
        <SectionHeader eyebrow="Why It Works" title={<>Three design principles traditional training <Gold>does not have.</Gold></>} />
        <div className="mx-auto mt-12 grid max-w-7xl gap-5 md:grid-cols-3">
          <IconStat icon={Clock3} title="Journey, not event" copy="ELEVATE™ spans 24 weeks, long enough to form habits, not just memories." />
          <IconStat icon={Users} title="Managed by your managers" copy="The Translate phase certifies sales managers as internal coaches so capability stays inside the business." />
          <IconStat icon={BarChart3} title="Measured at every step" copy="Every phase produces a deliverable, and every deliverable is measured." />
        </div>
      </section>
      <CTA title={<>Start your <Gold>transformation.</Gold></>} />
    </>
  );
}

function VerticalsPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries We Serve"
        title={
          <>
            Sector expertise that <Gold>speaks your language.</Gold>
          </>
        }
        body="We do not deliver generic coaching. Before we design a single session, we immerse ourselves in your industry's commercial dynamics, buyer culture, customer experience expectations, and competitive pressures."
        image={heroImages.verticals}
      />
      <section className="brand-navy px-5 py-10 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-3">
          {verticals.map((vertical) => (
            <a className="sector-pill" href={`#${vertical.id}`} key={vertical.id}>
              {vertical.name}
            </a>
          ))}
        </div>
      </section>
      <section className="brand-navy-alt px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8">
          {verticals.map((vertical, index) => (
            <Panel className="overflow-hidden" id={vertical.id} key={vertical.id} strong={index % 2 === 0}>
              <div className="grid gap-0 lg:grid-cols-[.85fr_1.15fr]">
                <img alt={`${vertical.name} sector`} className="h-full min-h-[320px] w-full object-cover" src={vertical.image} />
                <div className="p-7 lg:p-9">
                  <p className="brand-gold font-heading text-sm font-bold uppercase tracking-[0.26em]">{vertical.description}</p>
                  <h2 className="brand-white mt-3 font-heading text-3xl font-bold">{vertical.name}</h2>
                  <p className="brand-muted mt-5 leading-7">{vertical.why}</p>
                  <div className="mt-7 grid gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="brand-white font-heading text-lg font-bold">Programs we deliver</h3>
                      <BulletList items={vertical.programs} />
                    </div>
                    <div>
                      <h3 className="brand-white font-heading text-lg font-bold">Key pain points we solve</h3>
                      <BulletList items={vertical.pains} />
                    </div>
                  </div>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      </section>
      <CTA title={<>Your vertical. Your challenge. <Gold>Our program.</Gold></>} body="Tell us your sector, team size, and commercial challenge. We will come back with a program recommendation within 48 hours." />
    </>
  );
}

function InsightsPage() {
  const articles = usePublishedInsights();
  const featuredArticle = articles.find((article) => article.featured) ?? articles[0] ?? defaultArticles[0];
  const otherArticles = articles.filter((article) => article.id !== featuredArticle.id);

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title={
          <>
            Ideas for building <Gold>high-performing organizations.</Gold>
          </>
        }
        body="Explore practical perspectives on performance, leadership, customer experience, people systems, and sustainable growth."
        image={heroImages.insights}
      />
      <section className="brand-navy px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="brand-gold font-heading text-sm font-bold uppercase tracking-[0.3em]">Featured Insight</p>
          <Link className="mt-6 grid overflow-hidden rounded-2xl border border-gold/25 bg-[#0D2B4D] transition hover:-translate-y-1 hover:border-gold/50 lg:grid-cols-[.85fr_1.15fr]" to={`/insights/${featuredArticle.slug}`}>
            <div className="min-h-[320px] bg-cover bg-center" style={{ backgroundImage: `url(${heroImages.insights})` }} />
            <div className="p-7 md:p-9">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-[#C9952A]">{featuredArticle.category}</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/72">{featuredArticle.readTime}</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/72">{formatArticleDate(featuredArticle.publishedAt)}</span>
              </div>
              <h2 className="brand-white mt-5 font-heading text-3xl font-bold leading-tight md:text-4xl">{featuredArticle.title}</h2>
              <p className="brand-muted mt-5 leading-7">{featuredArticle.excerpt}</p>
              <p className="brand-gold mt-7 inline-flex items-center gap-2 font-heading text-sm font-bold">
                Read Article <ArrowRight size={18} />
              </p>
            </div>
          </Link>

          <div className="mt-14">
            <p className="brand-gold font-heading text-sm font-bold uppercase tracking-[0.3em]">All Insights</p>
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {otherArticles.map((article) => (
                <Link className="group rounded-2xl border border-white/10 bg-white/[0.055] p-6 transition hover:-translate-y-1 hover:border-gold/40 hover:bg-white/[0.075]" key={article.id} to={`/insights/${article.slug}`}>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-[#C9952A]">{article.category}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/62">{article.readTime}</span>
                  </div>
                  <h3 className="brand-white mt-5 font-heading text-xl font-bold leading-snug">{article.title}</h3>
                  <p className="brand-muted mt-4 text-sm leading-6">{article.excerpt}</p>
                  <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                    <span className="text-xs font-semibold text-white/45">{formatArticleDate(article.publishedAt)}</span>
                    <span className="brand-gold inline-flex items-center gap-1 font-heading text-sm font-bold">
                      Read <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function InsightDetailPage() {
  const { slug } = useParams();
  const articles = usePublishedInsights();
  const featuredArticle = articles.find((article) => article.slug === slug) ?? articles.find((article) => article.featured) ?? articles[0] ?? defaultArticles[0];

  return (
    <article className="brand-navy">
      <div
        className="h-[300px] bg-cover bg-center md:h-[380px]"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(7, 28, 53, .2), rgba(7, 28, 53, .1)), url(${heroImages.insights})`,
        }}
      />
      <section className="px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/62">
            <Link className="hover:text-white" to="/">
              Home
            </Link>
            <span>/</span>
            <span>Insights</span>
            <span>/</span>
            <span className="text-white/82">{featuredArticle.title}</span>
          </div>

          <h1 className="brand-white font-heading text-4xl font-bold leading-tight md:text-5xl">
            {featuredArticle.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/62">
            <span>{featuredArticle.category}</span>
            <span>{featuredArticle.readTime}</span>
            <span>{formatArticleDate(featuredArticle.publishedAt)}</span>
          </div>
          <p className="mt-4 text-sm text-white/62">Posted by {featuredArticle.author}</p>

          <p className="brand-muted mt-10 text-lg leading-8">{featuredArticle.excerpt}</p>

          {featuredArticle.body && (
            <div
              className="rich-content article-content mt-10 text-base leading-8 text-white/78"
              dangerouslySetInnerHTML={{ __html: featuredArticle.body }}
            />
          )}
        </div>
      </section>
    </article>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function subscribe(event: FormEvent) {
    event.preventDefault();
    setMessage("Adding you to the list...");

    if (!supabase) {
      setMessage("Newsletter form is ready. Add Supabase env vars to store subscribers.");
      return;
    }

    const { error } = await supabase.from("newsletter_subscribers").insert({ email });
    setMessage(error ? error.message : "Thank you. You are subscribed.");
    if (!error) setEmail("");
  }

  return (
    <section className="brand-navy px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div>
          <p className="brand-gold font-heading text-sm font-bold uppercase tracking-[0.3em]">Subscribe To The Newsletter</p>
          <h2 className="brand-white mt-4 font-heading text-4xl font-bold">The Performance Edge. <Gold>Weekly in your inbox.</Gold></h2>
          <p className="brand-muted mt-5 leading-7">Every week, one insight you can apply immediately. No fluff, no filler: evidence-based perspectives from the UAE frontline.</p>
          <p className="brand-gold mt-5 font-semibold">Also on LinkedIn: daily insights, frameworks, and field notes.</p>
        </div>
        <Panel className="p-7" strong>
          <form className="flex flex-col gap-4 md:flex-row" onSubmit={subscribe}>
            <input className="contact-input flex-1" onChange={(event) => setEmail(event.target.value)} placeholder="Email address" required type="email" value={email} />
            <button className="gold-button" type="submit">Subscribe</button>
          </form>
          {message && <p className="brand-muted mt-4 text-sm">{message}</p>}
        </Panel>
      </div>
    </section>
  );
}

function InsightsDashboardPage() {
  const navigate = useNavigate();
  const emptyForm = {
    title: "",
    category: "",
    readTime: "5 min read",
    excerpt: "",
    body: "",
    author: "Transcend Consultancy",
    status: "draft" as "draft" | "published",
    featured: false,
  };
  const [articles, setArticles] = useState<InsightArticle[]>(defaultArticles);
  const [formState, setFormState] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [status, setStatus] = useState("");
  const [activeWorkspace, setActiveWorkspace] = useState<"articles" | "users">("articles");
  const [dashboardUsers, setDashboardUsers] = useState<DashboardUser[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<DashboardRole>("admin");
  const [userForm, setUserForm] = useState({
    email: "",
    fullName: "",
    role: "editor" as DashboardRole,
    status: "invited" as DashboardUser["status"],
  });
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const canManageArticles = currentUserRole === "admin" || currentUserRole === "editor";
  const canManageUsers = currentUserRole === "admin";

  async function loadArticles(showStatus = false) {
    if (showStatus) setStatus("Refreshing articles...");

    if (!supabase) {
      setArticles(readLocalArticles());
      if (showStatus) setStatus("Loaded local articles.");
      return;
    }

    const { data, error } = await supabase
      .from("insights_articles")
      .select("id,title,slug,category,read_time,published_at,excerpt,body,author,status,featured,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setStatus(error.message);
      return;
    }

    setArticles((data ?? []).map(normalizeArticle));
    if (showStatus) setStatus("Article library refreshed.");
  }

  useEffect(() => {
    loadArticles();
    loadDashboardUsers();
  }, []);

  async function loadDashboardUsers(showStatus = false) {
    if (showStatus) setStatus("Refreshing dashboard users...");

    if (!supabase) {
      const localUsers = readLocalDashboardUsers();
      setDashboardUsers(localUsers);
      setCurrentUserRole("admin");
      if (showStatus) setStatus("Loaded local dashboard users.");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const currentEmail = userData.user?.email ?? "";
    const { data, error } = await supabase
      .from("dashboard_users")
      .select("id,user_id,email,full_name,role,status,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setStatus(error.message);
      return;
    }

    const normalizedUsers = (data ?? []).map(normalizeDashboardUser);
    setDashboardUsers(normalizedUsers);
    const currentProfile = normalizedUsers.find((user) => user.userId === userData.user?.id || user.email.toLowerCase() === currentEmail.toLowerCase());
    setCurrentUserRole(currentProfile?.role ?? (normalizedUsers.length === 0 ? "admin" : "viewer"));
    if (showStatus) setStatus("Dashboard users refreshed.");
  }

  function getArticlePayload(article: InsightArticle) {
    return {
      title: article.title,
      slug: article.slug,
      category: article.category,
      read_time: article.readTime,
      published_at: article.publishedAt,
      excerpt: article.excerpt,
      body: article.body,
      author: article.author,
      status: article.status,
      featured: article.featured,
      updated_at: new Date().toISOString(),
    };
  }

  async function persistArticle(article: InsightArticle, existingId?: string | null) {
    if (article.featured) {
      await supabase?.from("insights_articles").update({ featured: false }).eq("featured", true);
    }

    if (!supabase) {
      syncLocalArticles(applyFeaturedRule(article, articles));
      return { article };
    }

    const query = existingId
      ? supabase
          .from("insights_articles")
          .update(getArticlePayload(article))
          .eq("id", existingId)
          .select("id,title,slug,category,read_time,published_at,excerpt,body,author,status,featured,created_at")
          .single()
      : supabase
          .from("insights_articles")
          .insert(getArticlePayload(article))
          .select("id,title,slug,category,read_time,published_at,excerpt,body,author,status,featured,created_at")
          .single();

    const { data, error } = await query;
    if (error || !data) return { error: error?.message ?? "Unable to save article." };

    const savedArticle = normalizeArticle(data);
    setArticles(applyFeaturedRule(savedArticle, articles));
    return { article: savedArticle };
  }

  function resetForm() {
    setFormState(emptyForm);
    setEditingId(null);
  }

  function syncLocalArticles(nextArticles: InsightArticle[]) {
    setArticles(nextArticles);
    saveLocalArticles(nextArticles);
  }

  function applyFeaturedRule(nextArticle: InsightArticle, currentArticles: InsightArticle[]) {
    const others = currentArticles.filter((article) => article.id !== nextArticle.id);
    const normalizedOthers = nextArticle.featured
      ? others.map((article) => ({ ...article, featured: false }))
      : others;
    return [nextArticle, ...normalizedOthers];
  }

  async function submitArticle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canManageArticles) {
      setStatus("Your role is viewer. Article changes are disabled.");
      return;
    }

    const existingArticle = articles.find((article) => article.id === editingId);
    const article: InsightArticle = {
      id: editingId ?? crypto.randomUUID(),
      title: formState.title,
      slug: createArticleSlug(formState.title),
      category: formState.category || "Insights",
      readTime: formState.readTime || "5 min read",
      publishedAt: formState.status === "published" ? existingArticle?.publishedAt ?? new Date().toISOString() : null,
      excerpt: formState.excerpt,
      body: formState.body,
      author: formState.author || "Transcend Consultancy",
      status: formState.status,
      featured: formState.status === "published" && formState.featured,
      createdAt: existingArticle?.createdAt,
    };

    setStatus(editingId ? "Updating article..." : "Saving article...");

    const result = await persistArticle(article, editingId);
    if (result.error) {
      setStatus(result.error);
      return;
    }

    setStatus(article.status === "published" ? "Article saved and visible on the Insights page." : "Draft saved.");
    resetForm();
  }

  async function editArticle(article: InsightArticle) {
    setEditingId(article.id);
    setFormState({
      title: article.title,
      category: article.category,
      readTime: article.readTime,
      excerpt: article.excerpt,
      body: article.body,
      author: article.author,
      status: article.status,
      featured: article.featured,
    });
    setStatus("Editing selected article.");
  }

  async function updateArticleStatus(article: InsightArticle, nextStatus: "draft" | "published") {
    if (!canManageArticles) {
      setStatus("Your role is viewer. Article changes are disabled.");
      return;
    }

    const nextArticle: InsightArticle = {
      ...article,
      status: nextStatus,
      featured: nextStatus === "published" ? article.featured : false,
      publishedAt: nextStatus === "published" ? article.publishedAt ?? new Date().toISOString() : null,
    };

    setStatus(nextStatus === "published" ? "Publishing article..." : "Moving article to drafts...");
    const result = await persistArticle(nextArticle, article.id);
    setStatus(result.error ?? (nextStatus === "published" ? "Article published." : "Article moved to drafts."));
  }

  async function setFeaturedArticle(article: InsightArticle) {
    if (!canManageArticles) {
      setStatus("Your role is viewer. Article changes are disabled.");
      return;
    }

    if (article.status !== "published") {
      setStatus("Only published articles can be featured.");
      return;
    }

    const nextArticle = { ...article, featured: true };
    setStatus("Updating featured article...");
    const result = await persistArticle(nextArticle, article.id);
    setStatus(result.error ?? "Featured article updated.");
  }

  async function duplicateArticle(article: InsightArticle) {
    if (!canManageArticles) {
      setStatus("Your role is viewer. Article changes are disabled.");
      return;
    }

    const duplicate: InsightArticle = {
      ...article,
      id: crypto.randomUUID(),
      title: `${article.title} Copy`,
      slug: `${article.slug}-copy-${Date.now()}`,
      status: "draft",
      featured: false,
      publishedAt: null,
      createdAt: undefined,
    };

    setStatus("Duplicating article...");
    const result = await persistArticle(duplicate);
    setStatus(result.error ?? "Article duplicated as a draft.");
  }

  async function deleteArticle(article: InsightArticle) {
    if (!canManageArticles) {
      setStatus("Your role is viewer. Article changes are disabled.");
      return;
    }

    const confirmed = window.confirm(`Delete "${article.title}"? This cannot be undone.`);
    if (!confirmed) return;

    setStatus("Deleting article...");

    if (!supabase) {
      syncLocalArticles(articles.filter((item) => item.id !== article.id));
      if (editingId === article.id) resetForm();
      setStatus("Article deleted locally.");
      return;
    }

    const { error } = await supabase.from("insights_articles").delete().eq("id", article.id);
    if (error) {
      setStatus(error.message);
      return;
    }

    setArticles(articles.filter((item) => item.id !== article.id));
    if (editingId === article.id) resetForm();
    setStatus("Article deleted.");
  }

  function resetUserForm() {
    setUserForm({
      email: "",
      fullName: "",
      role: "editor",
      status: "invited",
    });
    setEditingUserId(null);
  }

  function syncLocalDashboardUsers(nextUsers: DashboardUser[]) {
    setDashboardUsers(nextUsers);
    saveLocalDashboardUsers(nextUsers);
  }

  async function submitDashboardUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canManageUsers) {
      setStatus("Only admins can manage dashboard users.");
      return;
    }

    const email = userForm.email.trim().toLowerCase();
    const duplicate = dashboardUsers.some((user) => user.email.toLowerCase() === email && user.id !== editingUserId);
    if (duplicate) {
      setStatus("A dashboard user with that email already exists.");
      return;
    }

    const payload = {
      email,
      full_name: userForm.fullName.trim(),
      role: userForm.role,
      status: userForm.status,
      updated_at: new Date().toISOString(),
    };

    setStatus(editingUserId ? "Updating dashboard user..." : "Adding dashboard user...");

    if (!supabase) {
      const nextUser: DashboardUser = {
        id: editingUserId ?? crypto.randomUUID(),
        userId: dashboardUsers.find((user) => user.id === editingUserId)?.userId ?? null,
        email: payload.email,
        fullName: payload.full_name,
        role: payload.role,
        status: payload.status,
        createdAt: dashboardUsers.find((user) => user.id === editingUserId)?.createdAt,
      };
      syncLocalDashboardUsers([nextUser, ...dashboardUsers.filter((user) => user.id !== nextUser.id)]);
      resetUserForm();
      setStatus(editingUserId ? "Dashboard user updated locally." : "Dashboard user added locally.");
      return;
    }

    const query = editingUserId
      ? supabase
          .from("dashboard_users")
          .update(payload)
          .eq("id", editingUserId)
          .select("id,user_id,email,full_name,role,status,created_at")
          .single()
      : supabase
          .from("dashboard_users")
          .insert(payload)
          .select("id,user_id,email,full_name,role,status,created_at")
          .single();

    const { data, error } = await query;
    if (error || !data) {
      setStatus(error?.message ?? "Unable to save dashboard user.");
      return;
    }

    const savedUser = normalizeDashboardUser(data);
    setDashboardUsers([savedUser, ...dashboardUsers.filter((user) => user.id !== savedUser.id)]);
    resetUserForm();
    setStatus(editingUserId ? "Dashboard user updated." : "Dashboard user added.");
  }

  function editDashboardUser(user: DashboardUser) {
    if (!canManageUsers) {
      setStatus("Only admins can manage dashboard users.");
      return;
    }

    setEditingUserId(user.id);
    setUserForm({
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      status: user.status,
    });
    setActiveWorkspace("users");
    setStatus("Editing dashboard user.");
  }

  async function deleteDashboardUser(user: DashboardUser) {
    if (!canManageUsers) {
      setStatus("Only admins can manage dashboard users.");
      return;
    }

    if (user.role === "admin" && dashboardUsers.filter((item) => item.role === "admin" && item.status !== "disabled").length <= 1) {
      setStatus("Keep at least one active admin.");
      return;
    }

    const confirmed = window.confirm(`Remove dashboard access for ${user.email}?`);
    if (!confirmed) return;

    setStatus("Removing dashboard user...");

    if (!supabase) {
      syncLocalDashboardUsers(dashboardUsers.filter((item) => item.id !== user.id));
      if (editingUserId === user.id) resetUserForm();
      setStatus("Dashboard user removed locally.");
      return;
    }

    const { error } = await supabase.from("dashboard_users").delete().eq("id", user.id);
    if (error) {
      setStatus(error.message);
      return;
    }

    setDashboardUsers(dashboardUsers.filter((item) => item.id !== user.id));
    if (editingUserId === user.id) resetUserForm();
    setStatus("Dashboard user removed.");
  }

  async function signOut() {
    await supabase?.auth.signOut();
    navigate("/login");
  }

  const publishedCount = articles.filter((article) => article.status === "published").length;
  const draftCount = articles.filter((article) => article.status === "draft").length;
  const featuredArticle = articles.find((article) => article.featured);
  const filteredArticles = articles.filter((article) => {
    const matchesStatus = statusFilter === "all" || article.status === statusFilter;
    const searchableText = `${article.title} ${article.category} ${article.excerpt} ${article.author}`.toLowerCase();
    return matchesStatus && searchableText.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#071C35] text-white">
      <div className="grid min-h-screen lg:grid-cols-[320px_1fr]">
        <aside className="border-r border-white/10 bg-[#09233F] p-6 lg:sticky lg:top-0 lg:h-screen">
          <img
            alt="Transcend Consultancy"
            className="h-14 w-auto"
            src="/brand/transcend-logo-blue.png"
          />
          <div className="mt-10">
            <p className="brand-gold font-heading text-xs font-bold uppercase tracking-[0.28em]">Content Studio</p>
            <h1 className="mt-3 font-heading text-2xl font-bold leading-tight">Insights Dashboard</h1>
            <p className="mt-3 text-sm leading-6 text-white/62">
              Write, manage, and publish articles for the public Insights page.
            </p>
          </div>

          <nav className="mt-10 grid gap-2">
            <button
              className={`rounded-xl px-4 py-3 text-left text-sm font-bold ${activeWorkspace === "articles" ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
              onClick={() => setActiveWorkspace("articles")}
              type="button"
            >
              Articles
            </button>
            <button
              className={`rounded-xl px-4 py-3 text-left text-sm font-bold ${activeWorkspace === "users" ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
              onClick={() => setActiveWorkspace("users")}
              type="button"
            >
              Users & Roles
            </button>
            <Link className="rounded-xl px-4 py-3 text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white" to="/insights">
              Public Insights Page
            </Link>
            <Link className="rounded-xl px-4 py-3 text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white" to="/">
              Website Home
            </Link>
          </nav>

          <button className="mt-10 w-full rounded-xl border border-white/20 px-4 py-3 text-sm font-bold text-white/80 hover:bg-white/10" onClick={signOut} type="button">
            Sign Out
          </button>
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">Current role</p>
            <p className="mt-1 font-heading text-lg font-bold text-[#C9952A]">{roleLabels[currentUserRole]}</p>
            <p className="mt-2 text-xs leading-5 text-white/55">{roleDescriptions[currentUserRole]}</p>
          </div>
        </aside>

        <main className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-[#071C35]/95 px-6 py-5 backdrop-blur lg:px-10">
            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
              <div>
                <p className="brand-gold font-heading text-xs font-bold uppercase tracking-[0.28em]">Article Workspace</p>
                <h2 className="mt-2 font-heading text-3xl font-bold">
                  {activeWorkspace === "users" ? "Users and roles" : editingId ? "Edit article" : "Create a new article"}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="grid gap-3 sm:grid-cols-4">
                  {[
                    ["Total", articles.length],
                    ["Published", publishedCount],
                    ["Drafts", draftCount],
                    ["Users", dashboardUsers.length],
                  ].map(([label, value]) => (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3" key={label}>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">{label}</p>
                      <p className="mt-1 font-heading text-2xl font-bold">{value}</p>
                    </div>
                  ))}
                </div>
                <button className="rounded-2xl border border-white/15 bg-white/[0.06] p-4 text-white/75 hover:bg-white/10" onClick={() => activeWorkspace === "users" ? loadDashboardUsers(true) : loadArticles(true)} type="button" aria-label="Refresh dashboard">
                  <RefreshCw size={20} />
                </button>
              </div>
            </div>
          </header>

          {activeWorkspace === "articles" ? (
          <div className="mx-auto grid max-w-[1500px] gap-6 p-6 lg:p-10 xl:grid-cols-[minmax(0,1.15fr)_minmax(380px,.85fr)]">
            <section className="rounded-3xl border border-white/10 bg-[#0D2B4D] p-6 shadow-2xl shadow-black/20">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="brand-gold font-heading text-xs font-bold uppercase tracking-[0.26em]">Editor</p>
                  <h3 className="mt-2 font-heading text-2xl font-bold">{editingId ? "Refine article details" : "Draft article details"}</h3>
                </div>
                {editingId && (
                  <button className="rounded-xl border border-white/20 px-4 py-2 text-sm font-bold text-white/80 hover:bg-white/10" onClick={resetForm} type="button">
                    Cancel Edit
                  </button>
                )}
              </div>

              <form className="mt-6 grid gap-5" onSubmit={submitArticle}>
                <label className="text-sm font-bold text-white/80">
                  Article title
                  <input className="contact-input mt-2" onChange={(event) => setFormState({ ...formState, title: event.target.value })} placeholder="Write a clear, specific title" required value={formState.title} />
                </label>

                <div className="grid gap-5 md:grid-cols-3">
                  <label className="text-sm font-bold text-white/80">
                    Category
                    <input className="contact-input mt-2" onChange={(event) => setFormState({ ...formState, category: event.target.value })} placeholder="Leadership" required value={formState.category} />
                  </label>
                  <label className="text-sm font-bold text-white/80">
                    Read time
                    <input className="contact-input mt-2" onChange={(event) => setFormState({ ...formState, readTime: event.target.value })} placeholder="5 min read" required value={formState.readTime} />
                  </label>
                  <label className="text-sm font-bold text-white/80">
                    Author
                    <input className="contact-input mt-2" onChange={(event) => setFormState({ ...formState, author: event.target.value })} placeholder="Author name" required value={formState.author} />
                  </label>
                </div>

                <label className="text-sm font-bold text-white/80">
                  Excerpt
                  <textarea className="contact-input mt-2 min-h-28" onChange={(event) => setFormState({ ...formState, excerpt: event.target.value })} placeholder="Short summary shown on the Insights page" required value={formState.excerpt} />
                </label>

                <label className="text-sm font-bold text-white/80">
                  Article body
                  <RichTextEditor
                    onChange={(body) => setFormState({ ...formState, body })}
                    value={formState.body}
                  />
                </label>

                <div className="grid gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:grid-cols-2">
                  <label className="text-sm font-bold text-white/80">
                    Publication status
                    <select
                      className="dashboard-select mt-2"
                      onChange={(event) => setFormState({ ...formState, status: event.target.value as "draft" | "published", featured: event.target.value === "published" ? formState.featured : false })}
                      value={formState.status}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </label>
                  <label className="flex items-center gap-3 self-end text-sm font-bold text-white/80">
                    <input
                      checked={formState.featured}
                      className="h-4 w-4 accent-[#C9952A]"
                      disabled={formState.status !== "published"}
                      onChange={(event) => setFormState({ ...formState, featured: event.target.checked })}
                      type="checkbox"
                    />
                    Feature this article on Insights
                  </label>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button className="gold-button disabled:cursor-not-allowed disabled:opacity-45" disabled={!canManageArticles} type="submit">
                    {editingId ? "Update Article" : "Save Article"} <Save size={18} />
                  </button>
                  <Link className="ghost-button" to="/insights">
                    Preview Public Page <Eye size={18} />
                  </Link>
                </div>
                {!canManageArticles && <p className="text-sm text-white/62">Viewer access is read-only. Ask an admin to change your role before editing content.</p>}
                {status && <p className="text-sm text-white/68">{status}</p>}
              </form>
            </section>

            <aside className="grid content-start gap-6">
              <section className="rounded-3xl border border-white/10 bg-[#0D2B4D] p-6">
                <p className="brand-gold font-heading text-xs font-bold uppercase tracking-[0.26em]">Live Preview</p>
                <div className="mt-5 rounded-2xl border border-gold/20 bg-white/[0.05] p-5">
                  <p className="brand-gold text-xs font-bold">{formState.category || "Category"} · {formState.readTime}</p>
                  <h3 className="mt-3 font-heading text-2xl font-bold leading-tight">{formState.title || "Article title preview"}</h3>
                  <p className="mt-4 text-sm leading-6 text-white/70">{formState.excerpt || "Your article summary will appear here."}</p>
                  <p className="mt-5 text-xs font-semibold text-white/45">Author: {formState.author}</p>
                  <div className="mt-5 max-h-[360px] overflow-y-auto rounded-xl border border-white/10 bg-white p-4">
                    {formState.body ? (
                      <div
                        className="rich-content rich-content-light text-sm leading-7 text-slate-800"
                        dangerouslySetInnerHTML={{ __html: formState.body }}
                      />
                    ) : (
                      <p className="text-sm leading-7 text-slate-400">Article body preview will appear here as you write.</p>
                    )}
                  </div>
                </div>
                {featuredArticle && (
                  <p className="mt-4 text-sm leading-6 text-white/60">
                    Current featured article: <span className="text-white">{featuredArticle.title}</span>
                  </p>
                )}
              </section>

              <section className="rounded-3xl border border-white/10 bg-[#0D2B4D] p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="brand-gold font-heading text-xs font-bold uppercase tracking-[0.26em]">Article Library</p>
                    <h3 className="mt-2 font-heading text-xl font-bold">Manage content</h3>
                  </div>
                  <button className="rounded-xl border border-white/20 p-3 text-white/70 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45" disabled={!canManageArticles} onClick={resetForm} type="button" aria-label="Create new article">
                    <Plus size={18} />
                  </button>
                </div>
                <div className="mt-5 grid gap-3">
                  <input
                    className="contact-input"
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search articles..."
                    value={searchTerm}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    {(["all", "published", "draft"] as const).map((filter) => (
                      <button
                        className={`rounded-xl border px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] ${
                          statusFilter === filter
                            ? "border-[#C9952A] bg-[#C9952A] text-white"
                            : "border-white/15 text-white/65 hover:bg-white/10"
                        }`}
                        key={filter}
                        onClick={() => setStatusFilter(filter)}
                        type="button"
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-5 max-h-[540px] space-y-4 overflow-y-auto pr-1">
                  {filteredArticles.map((article) => (
                    <article className="rounded-2xl border border-white/10 bg-white/[0.045] p-4" key={article.id}>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-white/10 px-2 py-1 text-xs font-bold uppercase tracking-[0.12em] text-white/70">{article.status}</span>
                        {article.featured && <span className="rounded-full bg-gold/20 px-2 py-1 text-xs font-bold text-[#C9952A]">Featured</span>}
                      </div>
                      <h4 className="mt-3 font-heading text-lg font-bold leading-snug">{article.title}</h4>
                      <p className="mt-2 text-xs font-semibold text-[#C9952A]">{articleMeta(article)}</p>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/62">{article.excerpt}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button className="rounded-lg border border-white/15 px-3 py-2 text-xs font-bold text-white/75 hover:bg-white/10" onClick={() => editArticle(article)} type="button">
                          Edit <Edit3 className="ml-1 inline" size={14} />
                        </button>
                        <button className="rounded-lg border border-white/15 px-3 py-2 text-xs font-bold text-white/75 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45" disabled={!canManageArticles} onClick={() => duplicateArticle(article)} type="button">
                          Duplicate <Copy className="ml-1 inline" size={14} />
                        </button>
                        {article.status === "published" ? (
                          <button className="rounded-lg border border-white/15 px-3 py-2 text-xs font-bold text-white/75 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45" disabled={!canManageArticles} onClick={() => updateArticleStatus(article, "draft")} type="button">
                            Unpublish
                          </button>
                        ) : (
                          <button className="rounded-lg border border-white/15 px-3 py-2 text-xs font-bold text-white/75 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45" disabled={!canManageArticles} onClick={() => updateArticleStatus(article, "published")} type="button">
                            Publish
                          </button>
                        )}
                        {article.status === "published" && !article.featured && (
                          <button className="rounded-lg border border-white/15 px-3 py-2 text-xs font-bold text-white/75 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45" disabled={!canManageArticles} onClick={() => setFeaturedArticle(article)} type="button">
                            Feature <Star className="ml-1 inline" size={14} />
                          </button>
                        )}
                        <button className="rounded-lg border border-white/15 px-3 py-2 text-xs font-bold text-white/75 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45" disabled={!canManageArticles} onClick={() => deleteArticle(article)} type="button">
                          Delete <Trash2 className="ml-1 inline" size={14} />
                        </button>
                      </div>
                    </article>
                  ))}
                  {!filteredArticles.length && (
                    <div className="rounded-2xl border border-dashed border-white/20 p-6 text-center">
                      <p className="font-heading text-lg font-bold">No articles found</p>
                      <p className="mt-2 text-sm leading-6 text-white/60">
                        Create a new article or change the search/filter options.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </aside>
          </div>
          ) : (
            <div className="mx-auto grid max-w-[1400px] gap-6 p-6 lg:p-10 xl:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
              <section className="rounded-3xl border border-white/10 bg-[#0D2B4D] p-6 shadow-2xl shadow-black/20">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="brand-gold font-heading text-xs font-bold uppercase tracking-[0.26em]">RBAC</p>
                    <h3 className="mt-2 font-heading text-2xl font-bold">{editingUserId ? "Edit dashboard user" : "Add dashboard user"}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/60">
                      Roles control what each authenticated account can do inside the dashboard.
                    </p>
                  </div>
                  {editingUserId && (
                    <button className="rounded-xl border border-white/20 px-4 py-2 text-sm font-bold text-white/80 hover:bg-white/10" onClick={resetUserForm} type="button">
                      Cancel Edit
                    </button>
                  )}
                </div>

                <form className="mt-6 grid gap-5" onSubmit={submitDashboardUser}>
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="text-sm font-bold text-white/80">
                      Full name
                      <input
                        className="contact-input mt-2"
                        disabled={!canManageUsers}
                        onChange={(event) => setUserForm({ ...userForm, fullName: event.target.value })}
                        placeholder="Team member name"
                        required
                        value={userForm.fullName}
                      />
                    </label>
                    <label className="text-sm font-bold text-white/80">
                      Email
                      <input
                        className="contact-input mt-2"
                        disabled={!canManageUsers}
                        onChange={(event) => setUserForm({ ...userForm, email: event.target.value })}
                        placeholder="name@company.com"
                        required
                        type="email"
                        value={userForm.email}
                      />
                    </label>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="text-sm font-bold text-white/80">
                      Role
                      <select
                        className="dashboard-select mt-2"
                        disabled={!canManageUsers}
                        onChange={(event) => setUserForm({ ...userForm, role: event.target.value as DashboardRole })}
                        value={userForm.role}
                      >
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </label>
                    <label className="text-sm font-bold text-white/80">
                      Status
                      <select
                        className="dashboard-select mt-2"
                        disabled={!canManageUsers}
                        onChange={(event) => setUserForm({ ...userForm, status: event.target.value as DashboardUser["status"] })}
                        value={userForm.status}
                      >
                        <option value="invited">Invited</option>
                        <option value="active">Active</option>
                        <option value="disabled">Disabled</option>
                      </select>
                    </label>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="font-heading text-sm font-bold text-white">Role permissions</p>
                    <div className="mt-4 grid gap-3">
                      {(Object.keys(roleLabels) as DashboardRole[]).map((role) => (
                        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4" key={role}>
                          <p className="font-heading text-sm font-bold text-[#C9952A]">{roleLabels[role]}</p>
                          <p className="mt-1 text-sm leading-6 text-white/62">{roleDescriptions[role]}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button className="gold-button disabled:cursor-not-allowed disabled:opacity-45" disabled={!canManageUsers} type="submit">
                      {editingUserId ? "Update User" : "Add User"} <Save size={18} />
                    </button>
                    <button className="ghost-button" onClick={() => loadDashboardUsers(true)} type="button">
                      Refresh Users <RefreshCw size={18} />
                    </button>
                  </div>
                  {!canManageUsers && <p className="text-sm text-white/62">Only admins can add, edit, disable, or remove dashboard users.</p>}
                  {status && <p className="text-sm text-white/68">{status}</p>}
                </form>
              </section>

              <section className="rounded-3xl border border-white/10 bg-[#0D2B4D] p-6 shadow-2xl shadow-black/20">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="brand-gold font-heading text-xs font-bold uppercase tracking-[0.26em]">User Directory</p>
                    <h3 className="mt-2 font-heading text-2xl font-bold">Dashboard access</h3>
                  </div>
                  <span className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white/60">
                    {dashboardUsers.length} users
                  </span>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
                  <div className="grid grid-cols-[1.2fr_.7fr_.6fr_.7fr] gap-4 bg-white/[0.06] px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                    <span>User</span>
                    <span>Role</span>
                    <span>Status</span>
                    <span>Actions</span>
                  </div>
                  <div className="divide-y divide-white/10">
                    {dashboardUsers.map((user) => (
                      <div className="grid grid-cols-1 gap-4 px-4 py-4 md:grid-cols-[1.2fr_.7fr_.6fr_.7fr] md:items-center" key={user.id}>
                        <div>
                          <p className="font-heading text-base font-bold text-white">{user.fullName || "Unnamed user"}</p>
                          <p className="mt-1 text-sm text-white/55">{user.email}</p>
                        </div>
                        <span className="w-fit rounded-full bg-[#C9952A]/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#C9952A]">{roleLabels[user.role]}</span>
                        <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-white/70">{user.status}</span>
                        <div className="flex flex-wrap gap-2">
                          <button
                            className="rounded-lg border border-white/15 px-3 py-2 text-xs font-bold text-white/75 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45"
                            disabled={!canManageUsers}
                            onClick={() => editDashboardUser(user)}
                            type="button"
                          >
                            Edit <Edit3 className="ml-1 inline" size={14} />
                          </button>
                          <button
                            className="rounded-lg border border-white/15 px-3 py-2 text-xs font-bold text-white/75 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45"
                            disabled={!canManageUsers}
                            onClick={() => deleteDashboardUser(user)}
                            type="button"
                          >
                            Remove <Trash2 className="ml-1 inline" size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {!dashboardUsers.length && (
                      <div className="p-8 text-center">
                        <p className="font-heading text-lg font-bold">No dashboard users yet</p>
                        <p className="mt-2 text-sm text-white/60">Add the first admin user to start managing RBAC.</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function ContactPage() {
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      company: String(form.get("company") ?? ""),
      sector: String(form.get("sector") ?? ""),
      team_size: String(form.get("team_size") ?? ""),
      challenge: String(form.get("challenge") ?? ""),
      message: String(form.get("challenge") ?? ""),
    };

    setStatus("Sending...");
    if (!supabase) {
      setStatus("Contact form is ready. Add Supabase env vars to save submissions.");
      return;
    }

    const { error } = await supabase.from("contact_submissions").insert(payload);
    setStatus(error ? error.message : "Thank you. We will respond within 24 hours.");
    if (!error) event.currentTarget.reset();
  }

  return (
    <>
      <PageHero
        eyebrow="Get In Touch"
        title={
          <>
            Let's start with a <Gold>conversation.</Gold>
          </>
        }
        body="No pitch deck. No hard sell. Just an honest 30-minute discussion about where your team is today and where you want it to go."
        image={heroImages.contact}
      />
      <section className="brand-navy scroll-mt-28 px-5 py-20 lg:px-8" id="contact-form">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <form className="brand-panel-strong rounded-lg p-6 shadow-card md:p-8" onSubmit={submit}>
            <p className="brand-gold font-heading text-sm font-bold uppercase tracking-[0.26em]">Send Us Your Enquiry</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input className="contact-input" name="name" placeholder="Name" required />
              <input className="contact-input" name="email" placeholder="Email" required type="email" />
              <input className="contact-input" name="phone" placeholder="Phone / WhatsApp" />
              <input className="contact-input" name="company" placeholder="Company" />
              <input className="contact-input" name="sector" placeholder="Sector" />
              <input className="contact-input" name="team_size" placeholder="Team size" />
              <textarea className="contact-input min-h-36 md:col-span-2" name="challenge" placeholder="Tell us what is not working" required />
            </div>
            <button className="gold-button mt-5" type="submit">
              Send My Enquiry <ArrowRight size={18} />
            </button>
            {status && <p className="brand-muted mt-4 text-sm">{status}</p>}
          </form>
          <div className="space-y-6">
            <Panel className="p-7">
              <h2 className="brand-white font-heading text-3xl font-bold">Direct <Gold>Contact</Gold></h2>
              {[
                [Mail, "hello@transcendhq.com"],
                [Phone, "+971 50 625 0843"],
                [MessageCircle, "Phone & WhatsApp"],
                [Globe2, "www.transcendhq.com"],
                [Linkedin, "/company/transcendhq"],
                [Instagram, "@transcendhq"],
              ].map(([Icon, text]) => (
                <div className="brand-white mt-5 flex items-center gap-3" key={String(text)}>
                  <Icon className="brand-gold" size={21} />
                  <span className="font-semibold">{String(text)}</span>
                </div>
              ))}
            </Panel>
          </div>
        </div>
      </section>
      <section className="brand-navy-alt px-5 py-20 lg:px-8">
        <SectionHeader eyebrow="What Happens Next" title={<>Three steps from enquiry to <Gold>transformation.</Gold></>} />
        <div className="mx-auto mt-12 grid max-w-7xl gap-5 md:grid-cols-3">
          <IconStat icon={FileCheck2} title="1. You Submit" copy="Fill in the enquiry form with as much context as you are comfortable sharing." />
          <IconStat icon={Clock3} title="2. We Respond" copy="We review every enquiry and respond within 24 hours with a proposed discovery call time." />
          <IconStat icon={Handshake} title="3. We Explore" copy="A focused 30-minute call to understand your situation and recommend the right path." />
        </div>
      </section>
      <section className="brand-navy px-5 py-20 lg:px-8">
        <SectionHeader eyebrow="Common Questions" title={<>Clear answers before the <Gold>first call.</Gold></>} />
        <div className="mx-auto mt-12 grid max-w-7xl gap-5 md:grid-cols-2">
          {[
            ["Do you work with small teams?", "Yes. Programs scale from teams of 5 to national salesforces of 500+."],
            ["How quickly can you start?", "Standalone workshops can be deployed within 2-3 weeks. Full ELEVATE™ programs are scoped during discovery."],
            ["What does the results guarantee mean?", "For ELEVATE™ engagements, measurable targets are defined upfront, tracked, and reported throughout."],
            ["Do you work outside the UAE?", "Our primary focus is UAE and MEA, with select GCC and South-East Asia engagements case by case."],
          ].map(([question, answer]) => (
            <Panel className="p-6" key={question}>
              <h3 className="brand-white font-heading text-xl font-bold">{question}</h3>
              <p className="brand-muted mt-3 leading-7">{answer}</p>
            </Panel>
          ))}
        </div>
      </section>
    </>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setStatus("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.");
      return;
    }

    setLoading(true);
    setStatus("Signing in...");
    const normalizedEmail = email.trim().toLowerCase();
    const passwordAttempts = password.trim() === password ? [password] : [password, password.trim()];
    let signInError: string | null = null;

    for (const passwordAttempt of passwordAttempts) {
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: passwordAttempt,
      });

      if (!error) {
        setLoading(false);
        navigate("/dashboard/insights");
        return;
      }

      signInError = error.message;
    }

    setLoading(false);

    setStatus(
      signInError === "Invalid login credentials"
        ? "Invalid login credentials. Confirm this email exists in Supabase Auth for the production project and that the password is correct."
        : signInError ?? "Unable to sign in.",
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Dashboard Login"
        title={
          <>
            Access the <Gold>article dashboard.</Gold>
          </>
        }
        body="Sign in to create, edit, publish, and feature Insights articles that appear on the public website."
        image={heroImages.insights}
      />
      <section className="brand-navy px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-xl">
          <form className="brand-panel-strong rounded-lg p-6 md:p-8" onSubmit={submit}>
            <p className="brand-gold font-heading text-sm font-bold uppercase tracking-[0.26em]">Admin Access</p>
            <h2 className="brand-white mt-3 font-heading text-3xl font-bold">Sign in</h2>
            <div className="mt-6 grid gap-4">
              <input
                className="contact-input"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                required
                type="email"
                value={email}
              />
              <input
                className="contact-input"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                required
                type="password"
                value={password}
              />
            </div>
            <button className="gold-button mt-6 w-full" disabled={loading} type="submit">
              {loading ? "Signing In..." : "Sign In"} <ArrowRight size={18} />
            </button>
            {status && <p className="brand-muted mt-4 text-sm">{status}</p>}
          </form>
        </div>
      </section>
    </>
  );
}

function ProtectedDashboard({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      if (!supabase) {
        setAuthenticated(true);
        setReady(true);
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setAuthenticated(Boolean(data.session));
      setReady(true);
    }

    checkSession();

    const authListener = supabase?.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(Boolean(session));
      setReady(true);
    });

    return () => {
      mounted = false;
      authListener?.data.subscription.unsubscribe();
    };
  }, []);

  if (!ready) {
    return (
      <section className="brand-navy min-h-screen px-5 py-20 lg:px-8">
        <p className="brand-muted mx-auto max-w-7xl">Checking dashboard access...</p>
      </section>
    );
  }

  if (!authenticated) {
    return <Navigate replace to="/login" />;
  }

  return <>{children}</>;
}

function Footer() {
  return (
    <footer className="brand-navy border-t border-white/10 px-5 py-12 text-white lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_1fr_1.2fr]">
        <div>
          <Logo />
          <p className="brand-subtle mt-5 max-w-xs text-sm font-semibold italic leading-6">
            Elevate <Gold>People.</Gold> Transform <Gold>Performance.</Gold> Transcend <Gold>Limits.</Gold>
          </p>
        </div>
        <div>
          <h2 className="brand-gold font-heading text-sm font-bold uppercase tracking-[0.24em]">Quick Links</h2>
          <div className="mt-5 grid gap-3">
            {navItems.map((item) => (
              <Link className="brand-muted text-sm hover:!text-[#C9952A]" key={item.href} to={item.href}>
                {item.label}
              </Link>
            ))}
            <Link className="brand-muted text-sm hover:!text-[#C9952A]" to="/contact#contact-form">Contact Us</Link>
          </div>
        </div>
        <div>
          <h2 className="brand-gold font-heading text-sm font-bold uppercase tracking-[0.24em]">Contact</h2>
          <div className="brand-subtle mt-5 flex flex-wrap gap-x-7 gap-y-3 text-sm">
            <span>hello@transcendhq.com</span>
            <span>www.transcendhq.com</span>
            <span>+971 50 625 0843</span>
          </div>
          <div className="mt-6 flex gap-5">
            {[Linkedin, Instagram, Facebook].map((Icon, index) => (
              <a className="brand-gold hover:!text-white" href="#" key={index} aria-label="Social profile">
                <Icon size={21} />
              </a>
            ))}
          </div>
          <p className="brand-subtle mt-8 text-sm font-semibold">
            © 2026 Transcend Consulting Group. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const target = document.querySelector(location.hash);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.pathname, location.hash]);

  return null;
}

export function App() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  return (
    <div className={`${isDashboardRoute ? "bg-[#071C35]" : "brand-navy"} min-h-screen`}>
      <ScrollToHash />
      {!isDashboardRoute && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/elevate" element={<ElevatePage />} />
          <Route path="/verticals" element={<VerticalsPage />} />
          <Route path="/industries" element={<VerticalsPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/insights/:slug" element={<InsightDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard/insights" element={<ProtectedDashboard><InsightsDashboardPage /></ProtectedDashboard>} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      {!isDashboardRoute && <Footer />}
    </div>
  );
}
