import { describe, expect, it } from "vitest";

import { healthOptions, stageOptions } from "../src/app/(main)/dashboard/crm/_components/opportunities-section";
import {
  categories as productCategories,
  statuses as productStatuses,
  products,
} from "../src/app/(main)/dashboard/products/_components/data";
import { roles } from "../src/app/(main)/dashboard/roles/_components/roles-table/data";
import {
  priorities as taskPriorities,
  statuses as taskStatuses,
  tasks as tasksData,
} from "../src/app/(main)/dashboard/tasks/_components/data";
import { readFileSync } from "node:fs";

type Order = { payment: string; fulfillment: string; id: string; date: string };
type Opportunity = { stage: string; health: string };

function readJson<T>(path: string): T[] {
  return JSON.parse(readFileSync(path, "utf8")) as T[];
}

function uniqueCheckedFilterValues(columnFilterValues: string[]) {
  return columnFilterValues.filter((v) => v !== "Todos");
}

const crmOpportunities = () =>
  readJson<Opportunity>("src/app/(main)/dashboard/crm/_components/opportunities-table/data.json");
const recentOrders = () =>
  readJson<Order>("src/app/(main)/dashboard/ecommerce/_components/recent-orders-table/data.json");

/**
 * Garantia da regra 4 do protocolo de tradução (PLANO-TRADUCAO.md):
 * o valor de cada opção de filtro é idêntico a um valor presente nos dados,
 * porque as tabelas filtram com `equalsString`.
 */
describe("filtros de dados (value = label = dado)", () => {
  it("crm: opções de estágio existem nos dados", () => {
    const stageValues = new Set(crmOpportunities().map((o) => o.stage));
    for (const option of uniqueCheckedFilterValues([...stageOptions])) {
      expect(stageValues, `estágio "${option}" não existe nos dados do CRM`).toContain(option);
    }
  });

  it("crm: opções de saúde existem nos dados", () => {
    const healthValues = new Set(crmOpportunities().map((o) => o.health));
    for (const option of uniqueCheckedFilterValues([...healthOptions])) {
      expect(healthValues, `saúde "${option}" não existe nos dados do CRM`).toContain(option);
    }
  });

  it("ecommerce: valores de pedido pertencem aos unions do schema", () => {
    for (const order of recentOrders()) {
      expect(
        ["Pago", "Pendente", "Reembolsado"],
        `pagamento "${order.payment}" de ${order.id} fora do union`,
      ).toContain(order.payment);
      expect(
        ["Atendido", "Devolvido", "Não atendido"],
        `entrega "${order.fulfillment}" de ${order.id} fora do union`,
      ).toContain(order.fulfillment);
    }
  });

  it("products: categorias e status existem nos dados", () => {
    const categoryValues = new Set(products.map((p) => p.category));
    const statusValues = new Set(products.map((p) => p.status));
    for (const option of productCategories) {
      expect(categoryValues, `categoria "${option}" não existe nos produtos`).toContain(option);
    }
    for (const option of productStatuses) {
      expect(statusValues, `status "${option}" não existe nos produtos`).toContain(option);
    }
  });

  it("roles: opções de proprietário/tipo mapeiam para os dados", () => {
    const ownerValues = new Set(roles.map((r) => r.owner));
    for (const option of ["Sistema", "Jane Doe", "Alex Kim", "Chris Lee"]) {
      expect(ownerValues, `proprietário "${option}" não existe nas funções`).toContain(option);
    }
    // tipos técnicos ("System"/"Custom") filtram por grupos de funções existentes
    const groupValues = new Set(roles.map((r) => r.group));
    for (const group of ["Funções do sistema", "Funções personalizadas"]) {
      expect(groupValues, `grupo "${group}" não existe nas funções`).toContain(group);
    }
  });

  it("tasks: status e prioridade existem nos dados", () => {
    const statusValues = new Set(tasksData.map((t) => t.status));
    const priorityValues = new Set(tasksData.map((t) => t.priority));
    for (const s of taskStatuses) {
      expect(statusValues, `status "${s.value}" não existe nas tarefas`).toContain(s.value);
    }
    for (const p of taskPriorities) {
      expect(priorityValues, `prioridade "${p.value}" não existe nas tarefas`).toContain(p.value);
    }
  });
});

/**
 * Datas nos mocks devem estar em formato ISO (protocolo, riscos §7):
 * um `parseISO` retroativo quebra a ordenação se um mock ficar em texto EN.
 */
describe("datas dos mocks em ISO", () => {
  it("orders: `date` parseia como data válida", () => {
    for (const order of recentOrders()) {
      expect(Number.isNaN(Date.parse(order.date)), `data "${order.date}" do pedido ${order.id} não é válida`).toBe(
        false,
      );
    }
  });
});
