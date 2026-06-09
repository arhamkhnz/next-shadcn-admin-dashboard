export const columns = [
  { id: "lead", title: "Lead", accent: "text-foreground", countTone: "bg-muted text-muted-foreground" },
  { id: "qualified", title: "Qualified", accent: "text-foreground", countTone: "bg-muted text-muted-foreground" },
  { id: "proposal", title: "Proposal", accent: "text-foreground", countTone: "bg-muted text-muted-foreground" },
  { id: "negotiation", title: "Negotiation", accent: "text-foreground", countTone: "bg-muted text-muted-foreground" },
  {
    id: "won",
    title: "Won",
    accent: "text-emerald-700 dark:text-emerald-300",
    countTone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
] as const;

export type ColumnId = (typeof columns)[number]["id"];

export type DealTag =
  | "Analytics"
  | "Automation"
  | "Branding"
  | "Consulting"
  | "CRM"
  | "Design"
  | "Dev"
  | "E-commerce"
  | "Enterprise"
  | "Growth"
  | "Integration"
  | "IT"
  | "Marketing"
  | "Mobile"
  | "Platform"
  | "Software"
  | "Web";

export type Deal = {
  id: string;
  company: string;
  description: string;
  amount: number;
  date: string;
  tags: DealTag[];
  comments: number;
  files: number;
  logo: string;
  logoTone: string;
  assignee: string;
  assigneeTone: string;
  won?: boolean;
};

export type BoardState = Record<ColumnId, Deal[]>;

export const columnIds = columns.map((column) => column.id) as ColumnId[];
