import { Download, FileText, LockKeyhole } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import type { ProfileDocument } from "./profile-data";

export function ProfileDocuments({ documents }: { documents: ProfileDocument[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-heading font-medium text-base">Documents</h2>
        <Button size="sm">
          <FileText data-icon="inline-start" />
          Adicionar documento
        </Button>
      </div>

      <Table className="border-y">
        <TableCaption className="sr-only">Documentos anexados a este perfil de terceiro</TableCaption>
        <TableHeader className="[&_th]:h-8">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-2/5">
              <span className="sr-only">Documento</span>
            </TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Atualizado</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Acesso</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <TableRow key={document.id}>
              <TableCell className="font-medium">{document.name}</TableCell>
              <TableCell className="text-muted-foreground">{document.category}</TableCell>
              <TableCell className="text-muted-foreground">{document.updatedAt}</TableCell>
              <TableCell>
                <Badge className="rounded-sm" variant="outline">
                  {document.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {document.isRestricted ? (
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground text-xs" title="Restrito">
                    <LockKeyhole aria-hidden="true" className="size-3.5" />
                    Restrito
                  </span>
                ) : (
                  <Button aria-label={`Baixar ${document.name}`} size="icon-sm" variant="ghost">
                    <Download />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
