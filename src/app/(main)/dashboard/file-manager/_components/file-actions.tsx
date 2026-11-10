import { Download, MoreVertical, Share2, Star, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { FileManagerFile } from "./data";

interface FileActionsProps {
  file: FileManagerFile;
  onToggleStar: () => void;
}

export function FileActions({ file, onToggleStar }: FileActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Ações para ${file.name}`}>
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={onToggleStar}>
            <Star />
            {file.starred ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Download />
            Download
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Share2 />
            Copiar link de compartilhamento
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive">
            <Trash2 />
            Mover para a lixeira
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
