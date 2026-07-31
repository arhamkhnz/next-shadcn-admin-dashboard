"use client";

import { useState } from "react";

import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { type FileManagerFile, fileIcons, fileKindLabels } from "./data";
import { FileActions } from "./file-actions";

interface FileGridViewProps {
  files: FileManagerFile[];
}

export function FileGridView({ files }: FileGridViewProps) {
  const [gridFiles, setGridFiles] = useState(files);

  function toggleStar(fileId: string) {
    setGridFiles((current) => current.map((file) => (file.id === fileId ? { ...file, starred: !file.starred } : file)));
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {gridFiles.map((file) => {
        const FileIcon = fileIcons[file.kind];

        return (
          <Card key={file.id} size="sm" className="group/file">
            <CardContent>
              <div className="relative flex h-36 items-center justify-center rounded-lg bg-muted/50">
                <FileIcon className="size-12 text-muted-foreground" aria-hidden="true" />
                <Button
                  variant="secondary"
                  size="icon-sm"
                  className={cn(
                    "absolute top-2 right-2 opacity-0 focus-visible:opacity-100 group-hover/file:opacity-100",
                    file.starred && "opacity-100",
                  )}
                  aria-label={file.starred ? `Unstar ${file.name}` : `Star ${file.name}`}
                  onClick={() => toggleStar(file.id)}
                >
                  <Star className={cn(file.starred && "fill-current")} />
                </Button>
                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 text-muted-foreground text-xs">
                  <span>{fileKindLabels[file.kind]}</span>
                  <span>{file.size}</span>
                </div>
              </div>
            </CardContent>
            <CardHeader>
              <CardTitle className="truncate">{file.name}</CardTitle>
              <CardDescription className="truncate">
                Modified {file.modifiedAt} by {file.owner}
              </CardDescription>
              <CardAction>
                <FileActions file={file} onToggleStar={() => toggleStar(file.id)} />
              </CardAction>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
