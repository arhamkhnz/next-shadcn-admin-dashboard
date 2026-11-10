"use client";
import { useState } from "react";

import { type ColumnFiltersState, type PaginationState, useTable } from "@tanstack/react-table";
import { AlertTriangle, ChevronRight, FileUp, Search } from "lucide-react";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dataTableFeatures } from "@/lib/data-table-features";

import { rolesColumns } from "./roles-table/columns";
import type { Role } from "./roles-table/data";
import { RolesTable } from "./roles-table/table";

function getRoleTypeFilter(groupFilter: string) {
  if (groupFilter === "Funções do sistema") {
    return "System";
  }

  if (groupFilter === "Funções personalizadas") {
    return "Custom";
  }

  return "Todos";
}

function getRoleGroupFilterValue(typeFilter: string) {
  if (typeFilter === "System") {
    return "Funções do sistema";
  }

  if (typeFilter === "Custom") {
    return "Funções personalizadas";
  }

  return undefined;
}

export function Roles({ roles }: { roles: Role[] }) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 12,
  });

  const table = useTable({
    features: dataTableFeatures,
    data: roles,
    columns: rolesColumns,
    defaultColumn: {
      size: 140,
      minSize: 80,
      maxSize: 420,
    },
    state: { columnFilters, pagination },
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    initialState: {
      columnVisibility: { group: false, search: false },
    },
  });

  const search = (table.getColumn("search")?.getFilterValue() as string | undefined) ?? "";
  const groupFilter = (table.getColumn("group")?.getFilterValue() as string | undefined) ?? "";
  const typeFilter = getRoleTypeFilter(groupFilter);
  const ownerFilter = (table.getColumn("owner")?.getFilterValue() as string | undefined) ?? "Todos";
  const statusFilter = (table.getColumn("status")?.getFilterValue() as string | undefined) ?? "Todos";

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl tracking-tight">Funções e Permissões</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie funções e permissões de acesso em toda a organização.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <FileUp data-icon="inline-start" />
            Importar JSON
          </Button>
          <Button size="sm">Criar função</Button>
        </div>
      </div>

      <Tabs className="h-full gap-4" defaultValue="roles">
        <TabsList
          variant="line"
          className="w-full justify-start gap-2 border-b ps-0 *:data-[slot=tabs-trigger]:flex-none"
        >
          <TabsTrigger value="roles">Funções</TabsTrigger>
          <TabsTrigger value="permission-sets">Conjuntos de permissões</TabsTrigger>
          <TabsTrigger value="access-reviews">Revisões de acesso</TabsTrigger>
        </TabsList>

        <TabsContent value="roles">
          <div className="flex flex-col gap-4">
            <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
              <AlertTriangle className="size-4" />
              <AlertTitle>Revisão necessária</AlertTitle>
              <AlertDescription>3 funções têm alterações de permissão não revisadas.</AlertDescription>
              <AlertAction>
                <Button size="sm" variant="link">
                  Revisar alterações
                  <ChevronRight data-icon="inline-end" />
                </Button>
              </AlertAction>
            </Alert>

            <div className="overflow-hidden rounded-xl border border-border/70 bg-background">
              <div className="flex flex-col items-stretch gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <InputGroup className="h-7 w-full rounded-md sm:w-82">
                  <InputGroupAddon>
                    <Search />
                  </InputGroupAddon>
                  <InputGroupInput
                    className="h-7"
                    placeholder="Buscar funções..."
                    value={search}
                    onChange={(e) => {
                      table.getColumn("search")?.setFilterValue(e.target.value || undefined);
                      table.setPageIndex(0);
                    }}
                  />
                </InputGroup>

                <div className="flex flex-wrap items-center gap-2">
                  <Select
                    value={typeFilter}
                    onValueChange={(v) => {
                      table.getColumn("group")?.setFilterValue(getRoleGroupFilterValue(v));
                      table.setPageIndex(0);
                    }}
                  >
                    <SelectTrigger size="sm">
                      <span className="text-muted-foreground">Tipo:</span>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent position="popper" align="start">
                      <SelectGroup>
                        <SelectItem value="Todos">Todos</SelectItem>
                        <SelectItem value="System">Sistema</SelectItem>
                        <SelectItem value="Custom">Personalizada</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <Select
                    value={ownerFilter}
                    onValueChange={(v) => {
                      table.getColumn("owner")?.setFilterValue(v === "Todos" ? undefined : v);
                      table.setPageIndex(0);
                    }}
                  >
                    <SelectTrigger size="sm">
                      <span className="text-muted-foreground">Proprietário:</span>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent position="popper" align="start">
                      <SelectGroup>
                        <SelectItem value="Todos">Todos</SelectItem>
                        <SelectItem value="System">Sistema</SelectItem>
                        <SelectItem value="Jane Doe">Jane Doe</SelectItem>
                        <SelectItem value="Alex Kim">Alex Kim</SelectItem>
                        <SelectItem value="Chris Lee">Chris Lee</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <Select
                    value={statusFilter}
                    onValueChange={(v) => {
                      table.getColumn("status")?.setFilterValue(v === "Todos" ? undefined : v);
                      table.setPageIndex(0);
                    }}
                  >
                    <SelectTrigger size="sm">
                      <span className="text-muted-foreground">Status:</span>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent position="popper" align="start">
                      <SelectGroup>
                        <SelectItem value="Todos">Todos</SelectItem>
                        <SelectItem value="Ativa">Ativa</SelectItem>
                        <SelectItem value="Precisa de revisão">Precisa de revisão</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <RolesTable table={table} />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="permission-sets">
          <div className="flex h-full items-center justify-center rounded-md border border-dashed text-muted-foreground text-sm">
            Conjuntos de Permissões em Breve
          </div>
        </TabsContent>
        <TabsContent value="access-reviews">
          <div className="flex h-full items-center justify-center rounded-md border border-dashed text-muted-foreground text-sm">
            Revisões de Acesso em Breve
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
