import { Clock, Folder, MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

import type { FileManagerFolder } from "./data";

interface FoldersSectionProps {
  folders: FileManagerFolder[];
}

export function FoldersSection({ folders }: FoldersSectionProps) {
  return (
    <section className="flex flex-col gap-2" aria-labelledby="folders-heading">
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-lg">Folders</h2>
        <span className="text-muted-foreground text-sm">{folders.length} folders</span>
      </div>
      {folders.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {folders.map((folder) => (
            <Card key={folder.id} size="sm">
              <CardHeader>
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Folder className="size-4.5" />
                  </div>
                  <div className="flex min-w-0 flex-col gap-1">
                    <CardTitle className="truncate leading-none">{folder.name}</CardTitle>
                    <CardDescription className="text-xs">{folder.fileCount} files</CardDescription>
                  </div>
                </div>
                <CardAction>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${folder.name}`}>
                        <MoreVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuItem>Open folder</DropdownMenuItem>
                        <DropdownMenuItem>Copy share link</DropdownMenuItem>
                        <DropdownMenuItem>Rename</DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardAction>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-3 text-muted-foreground text-xs">
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  <span>Updated {folder.updatedAt}</span>
                </div>
                <span>{folder.size}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Empty className="min-h-32">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Folder />
            </EmptyMedia>
            <EmptyTitle>No folders yet</EmptyTitle>
            <EmptyDescription>Create a folder to organize your files.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </section>
  );
}
