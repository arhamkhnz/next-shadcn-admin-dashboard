import { Users } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import type { ProfileRecord } from "./profile-data";

interface ProfileOverviewProps {
  profile: ProfileRecord;
}

export function ProfileOverview({ profile }: ProfileOverviewProps) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h2 className="font-heading font-medium text-base">Sobre</h2>
        <p className="text-muted-foreground text-sm">{profile.bio}</p>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col gap-2">
        <h2 className="font-heading font-medium text-base">Dados de trabalho</h2>
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-12">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">ID do terceiro</span>
              <span className="text-sm">{profile.contractorId}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">Status de engajamento</span>
              <span className="text-sm">{profile.engagementStatus}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">Nível</span>
              <span className="text-sm">{profile.jobLevel}</span>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">Departamento</span>
              <span className="text-sm">{profile.department}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">Equipe</span>
              <span className="text-sm">{profile.team}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">Projeto atual</span>
              <span className="text-sm">{profile.currentProject}</span>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">Data de início</span>
              <span className="text-sm">{profile.startDate}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">Tempo de engajamento</span>
              <span className="text-sm">{profile.engagementLength}</span>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <h2 className="font-heading font-medium text-base leading-none">Linha de reporte</h2>
            <p className="text-muted-foreground text-sm">Gestor direto</p>
          </div>
          <Button size="sm" variant="outline">
            <Users data-icon="inline-start" />
            Organograma
          </Button>
        </div>
        <div className="flex items-center gap-3 py-3">
          <Avatar size="lg">
            <AvatarFallback>{profile.manager.initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{profile.manager.name}</p>
            <p className="text-muted-foreground text-xs">{profile.manager.role}</p>
          </div>
        </div>
      </div>
    </>
  );
}
