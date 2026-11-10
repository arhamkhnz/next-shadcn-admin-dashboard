"use client";

import { useState } from "react";

import { cn } from "cn";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Star } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { type FileManagerFile, fileIcons } from "./data";
import { FileActions } from "./file-actions";

interface FileListViewProps {
  files: FileManagerFile[];
}

export function FileListView({ files }: FileListViewProps) {
  const [listFiles, setListFiles] = useState(files);

  function toggleStar(fileId: string) {
    setListFiles((current) => current.map((file) => (file.id === fileId ? { ...file, starred: !file.starred } : file)));
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="pl-0">Nome</TableHead>
          <TableHead className="hidden md:table-cell">Proprietário</TableHead>
          <TableHead className="hidden lg:table-cell">Modificado</TableHead>
          <TableHead className="hidden sm:table-cell">Tamanho</TableHead>
          <TableHead className="w-20">
            <span className="sr-only">Ações</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {listFiles.map((file) => {
          const FileIcon = fileIcons[file.kind];

          return (
            <TableRow key={file.id}>
              <TableCell className="pl-0">
                <div className="flex min-w-0 items-center gap-3">
                  <FileIcon className="size-5 shrink-0 text-muted-foreground" />
                  <Button variant="link" size="sm" className="h-auto max-w-72 justify-start px-0">
                    <span className="truncate">{file.name}</span>
                  </Button>
                  {file.shared && (
                    <Badge variant="outline" className="hidden xl:inline-flex">
                      Compartilhado
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex items-center gap-2">
                  <Avatar size="sm">
                    <AvatarFallback>{file.ownerInitials}</AvatarFallback>
                  </Avatar>
                  <span>{file.owner}</span>
                </div>
              </TableCell>
              <TableCell className="hidden text-muted-foreground lg:table-cell">
                {format(parseISO(file.modifiedAt), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
              </TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">{file.size}</TableCell>
              <TableCell>
                <div className="flex items-center justify-end">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={file.starred ? `Desfavoritar ${file.name}` : `Favoritar ${file.name}`}
                    onClick={() => toggleStar(file.id)}
                  >
                    <Star className={cn(file.starred && "fill-current")} />
                  </Button>
                  <FileActions file={file} onToggleStar={() => toggleStar(file.id)} />
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
