import { LockKeyhole } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import type { ProfileRecord } from "./profile-data";

export function PersonalDetails({ profile }: { profile: ProfileRecord }) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-heading font-medium text-base">Informações pessoais</h2>
          <Badge className="rounded-sm" variant="outline">
            <LockKeyhole data-icon="inline-start" />
            Privado
          </Badge>
        </div>
        <dl className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-12">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Nome preferido</dt>
              <dd className="text-sm">{profile.preferredName}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Data de nascimento</dt>
              <dd className="text-sm">{profile.dateOfBirth}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Nome legal</dt>
              <dd className="text-sm">{profile.legalName}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">E-mail pessoal</dt>
              <dd className="text-sm">{profile.personalEmail}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Pronomes</dt>
              <dd className="text-sm">{profile.pronouns}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Telefone de trabalho</dt>
              <dd className="text-sm">{profile.workPhone}</dd>
            </div>
          </div>
        </dl>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-heading font-medium text-base">Endereço e contato de emergência</h2>
          <Badge className="rounded-sm" variant="outline">
            <LockKeyhole data-icon="inline-start" />
            Privado
          </Badge>
        </div>
        <dl className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-12">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Endereço residencial</dt>
              <dd className="text-sm">{profile.address}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Contato de emergência</dt>
              <dd className="text-sm">{profile.emergencyContact}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs">Telefone de emergência</dt>
              <dd className="text-sm">{profile.emergencyPhone}</dd>
            </div>
          </div>
        </dl>
      </div>
    </>
  );
}
