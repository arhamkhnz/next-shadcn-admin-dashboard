import { Separator } from "@/components/ui/separator";

import type { ProfileRecord } from "./profile-data";

export function EmploymentDetails({ profile }: { profile: ProfileRecord }) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h2 className="font-heading font-medium text-base">Função e organização</h2>
        <dl className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-12">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Cargo</dt>
              <dd className="text-sm">{profile.jobTitle}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Equipe</dt>
              <dd className="text-sm">{profile.team}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Nível</dt>
              <dd className="text-sm">{profile.jobLevel}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Gestor</dt>
              <dd className="text-sm">{profile.manager.name}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Departamento</dt>
              <dd className="text-sm">{profile.department}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Projeto atual</dt>
              <dd className="text-sm">{profile.currentProject}</dd>
            </div>
          </div>
        </dl>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col gap-2">
        <h2 className="font-heading font-medium text-base">Detalhes do contrato</h2>
        <dl className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-12">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">ID do terceiro</dt>
              <dd className="text-sm">{profile.contractorId}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Status de engajamento</dt>
              <dd className="text-sm">{profile.engagementStatus}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Tipo de contratação</dt>
              <dd className="text-sm">{profile.employmentType}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Entidade contratante</dt>
              <dd className="text-sm">{profile.contractingEntity}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Data de início</dt>
              <dd className="text-sm">{profile.startDate}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Último dia de trabalho</dt>
              <dd className="text-sm">{profile.lastWorkingDay}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Período de aviso</dt>
              <dd className="text-sm">{profile.noticePeriod}</dd>
            </div>
          </div>
        </dl>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col gap-2">
        <h2 className="font-heading font-medium text-base">Arranjo de trabalho</h2>
        <dl className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-12">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Local de trabalho</dt>
              <dd className="text-sm">{profile.workplace}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Fuso horário</dt>
              <dd className="text-sm">{profile.timeZone}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Horas semanais</dt>
              <dd className="text-sm">{profile.weeklyHours}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Horário</dt>
              <dd className="text-sm">{profile.schedule}</dd>
            </div>
          </div>
        </dl>
      </div>
    </>
  );
}
