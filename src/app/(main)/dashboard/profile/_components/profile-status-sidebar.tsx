import { CalendarDays, CircleCheck, Clock3 } from "lucide-react";

import { Separator } from "@/components/ui/separator";

import type { ProfileRecord } from "./profile-data";

export function ProfileStatusSidebar({ profile }: { profile: ProfileRecord }) {
  return (
    <aside>
      <div className="flex flex-col gap-4">
        <h2 className="font-heading font-medium text-sm">Status do registro</h2>
        <div className="flex items-start gap-2">
          <CircleCheck aria-hidden="true" className="mt-0.5 size-4 text-muted-foreground" />
          <div>
            <p className="font-medium text-sm">Terceiro ativo</p>
            <p className="text-muted-foreground text-xs">Contrato e acessos ativos</p>
          </div>
        </div>
        <p className="text-muted-foreground text-xs">
          Atualizado em {profile.updatedAt} por {profile.updatedBy}
        </p>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col gap-3">
        <h2 className="font-heading font-medium text-sm">Próximos eventos</h2>
        <div className="flex flex-col">
          <div className="flex gap-3 py-2.5">
            <CalendarDays aria-hidden="true" className="mt-0.5 size-4 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">Licença</p>
              <p className="text-muted-foreground text-xs">{profile.nextLeave}</p>
            </div>
          </div>
          <Separator />
          <div className="flex gap-3 py-2.5">
            <Clock3 aria-hidden="true" className="mt-0.5 size-4 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">Último dia de trabalho</p>
              <p className="text-muted-foreground text-xs">{profile.lastWorkingDay}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
