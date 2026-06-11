export const columns = [
  { id: "ideas", title: "Ideas", accent: "text-foreground", countTone: "bg-muted text-muted-foreground" },
  { id: "planned", title: "Planned", accent: "text-foreground", countTone: "bg-muted text-muted-foreground" },
  { id: "building", title: "Building", accent: "text-foreground", countTone: "bg-muted text-muted-foreground" },
  { id: "qa", title: "QA", accent: "text-foreground", countTone: "bg-muted text-muted-foreground" },
  {
    id: "shipped",
    title: "Shipped",
    accent: "text-foreground",
    countTone: "bg-muted text-muted-foreground",
  },
] as const;

export type ColumnId = (typeof columns)[number]["id"];

export type TaskTeam =
  | "Backend"
  | "Data"
  | "Design"
  | "Docs"
  | "Finance Ops"
  | "Platform"
  | "Product"
  | "QA"
  | "Security";

export type TaskPriority = "High" | "Medium" | "Low";

export type TaskInsightLabel = "Attachments" | "Comments" | "Documents";

export type TaskInsight = {
  label: TaskInsightLabel;
  count: number;
};

export type TaskOwnerProfile = {
  name: string;
  tone: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  progress: number;
  owner: TaskOwnerProfile;
  team: TaskTeam;
  insights: TaskInsight[];
};

export type BoardState = Record<ColumnId, Task[]>;

export const columnIds = columns.map((column) => column.id) as ColumnId[];
