export type ColumnId = "ideas" | "planned" | "building" | "qa" | "shipped";

export type Column = {
  id: ColumnId;
  title: string;
};

export type TaskTeam =
  | "Backend"
  | "Dados"
  | "Design"
  | "Docs"
  | "Operações Financeiras"
  | "Plataforma"
  | "Produto"
  | "QA"
  | "Segurança";

export type TaskPriority = "Alta" | "Média" | "Baixa";

export type TaskInsightLabel = "Anexos" | "Comentários" | "Documentos";

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
