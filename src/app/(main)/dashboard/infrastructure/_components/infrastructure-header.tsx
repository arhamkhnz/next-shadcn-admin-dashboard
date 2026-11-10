import { Box, Container, Filter, PlusCircle, RefreshCw, Search, Server, Settings } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";

export function InfrastructureHeader() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-col gap-1">
            <h1 className="font-medium text-2xl leading-tight tracking-tight sm:text-3xl sm:leading-none">
              Visão geral da infraestrutura
            </h1>
            <p className="text-muted-foreground text-sm">
              Monitore ambientes, saúde dos servidores, uptime e uso de recursos em todos os projetos.
            </p>
          </div>

          <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
            <span className="whitespace-nowrap text-muted-foreground text-sm">Atualizado há 30 segundos</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon-sm">
                <RefreshCw />
              </Button>
              <Button variant="outline" size="icon-sm">
                <Settings data-icon="inline-start" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="h-auto gap-1 rounded-sm px-1.5 py-0.5">
            <Container />6 projetos
          </Badge>
          <Badge variant="outline" className="h-auto gap-1 rounded-sm px-1.5 py-0.5">
            <Box />
            16 ambientes
          </Badge>
          <Badge variant="outline" className="h-auto gap-1 rounded-sm px-1.5 py-0.5">
            <Server />
            36 servidores
          </Badge>
          <Badge variant="outline" className="h-auto gap-1 rounded-sm px-1.5 py-0.5">
            <span className="size-2 rounded-full bg-green-600 dark:bg-green-500" />
            99.93% de uptime global
          </Badge>
        </div>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row">
        <InputGroup className="flex-1">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput placeholder="Buscar por nome ou domínio…" />
          <InputGroupAddon align="inline-end">
            <Kbd>⌘ K</Kbd>
          </InputGroupAddon>
        </InputGroup>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <PlusCircle data-icon="inline-start" />
            Organização
          </Button>
          <Button variant="outline">
            <PlusCircle data-icon="inline-start" />
            Stack
          </Button>
          <Button variant="outline">
            <PlusCircle data-icon="inline-start" />
            Provedor de nuvem
          </Button>
          <Button variant="outline">
            <PlusCircle data-icon="inline-start" />
            Tipo de projeto
          </Button>
          <Button variant="outline">
            <PlusCircle data-icon="inline-start" />
            Ambiente
          </Button>
          <Button variant="outline">
            <Filter data-icon="inline-start" />
            Filtros
          </Button>
        </div>
      </div>
    </div>
  );
}
