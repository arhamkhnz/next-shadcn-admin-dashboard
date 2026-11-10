export const orderFilters = ["Todos", "Precisa de ação", "Não atendido", "Não pago", "Devoluções"] as const;

export type OrderFilter = (typeof orderFilters)[number];

export type OrderRow = {
  id: string;
  date: string;
  customer: string;
  payment: "Pago" | "Pendente" | "Reembolsado";
  total: string;
  items: string;
  fulfillment: "Atendido" | "Devolvido" | "Não atendido";
};
