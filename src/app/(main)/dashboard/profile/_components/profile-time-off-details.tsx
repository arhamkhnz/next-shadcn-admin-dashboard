import { Separator } from "@/components/ui/separator";

import type { ProfileRecord } from "./profile-data";

export function TimeOffDetails({ profile }: { profile: ProfileRecord }) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h2 className="font-heading font-medium text-base">Saldo de licenças</h2>
        <dl className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-12">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Política</dt>
              <dd className="text-sm">{profile.leavePolicy}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Saldo transportado</dt>
              <dd className="text-sm">{profile.carriedOverLeave}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Cota anual</dt>
              <dd className="text-sm">{profile.annualLeaveAllowance}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Usado neste ano</dt>
              <dd className="text-sm">{profile.usedLeave}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Restante</dt>
              <dd className="text-sm">{profile.remainingLeave}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Agendado</dt>
              <dd className="text-sm">{profile.scheduledLeave}</dd>
            </div>
          </div>
        </dl>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col gap-2">
        <h2 className="font-heading font-medium text-base">Próximos períodos e aprovações</h2>
        <dl className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-12">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Próxima licença</dt>
              <dd className="text-sm">{profile.nextLeave}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Solicitações pendentes</dt>
              <dd className="text-sm">{profile.pendingLeaveRequests}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Ano de licença</dt>
              <dd className="text-sm">{profile.leaveYear}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Aprovador</dt>
              <dd className="text-sm">{profile.manager.name}</dd>
            </div>
          </div>
        </dl>
      </div>
    </>
  );
}
