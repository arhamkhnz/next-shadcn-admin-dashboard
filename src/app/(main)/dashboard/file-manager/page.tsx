import Link from "next/link";

import { FolderPlus, Grid2X2, List, Upload } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { type FileManagerView, files, folders } from "./_components/data";
import { FileGridView } from "./_components/file-grid-view";
import { FileListView } from "./_components/file-list-view";
import { FileManagerToolbar } from "./_components/file-manager-toolbar";
import { FoldersSection } from "./_components/folders-section";

export const metadata: Metadata = {
  title: "Gerenciador de arquivos open source com shadcn/ui",
  description:
    "Explore um gerenciador de arquivos open source para navegar, organizar, enviar e visualizar arquivos e pastas.",
  alternates: {
    canonical: "/dashboard/file-manager",
  },
};

interface PageProps {
  searchParams: Promise<{ view?: string | string[] }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { view } = await searchParams;
  const activeView: FileManagerView = view === "list" ? "list" : "grid";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl leading-none tracking-tight">Meus arquivos</h1>
          <p className="text-muted-foreground text-sm">
            Organize, compartilhe e encontre arquivos do espaço de trabalho.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <FolderPlus data-icon="inline-start" />
            Nova pasta
          </Button>
          <Button>
            <Upload data-icon="inline-start" />
            Enviar
          </Button>
        </div>
      </div>
      <FileManagerToolbar />
      <FoldersSection folders={folders} />
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-medium text-lg">Todos os arquivos</h2>
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            spacing={0}
            value={activeView}
            aria-label="Visualização de arquivos"
          >
            <ToggleGroupItem value="grid" asChild>
              <Link href="?view=grid" prefetch={false} replace scroll={false}>
                <Grid2X2 />
                Grade
              </Link>
            </ToggleGroupItem>
            <ToggleGroupItem value="list" asChild>
              <Link href="?view=list" prefetch={false} replace scroll={false}>
                <List />
                Lista
              </Link>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        {activeView === "list" ? <FileListView files={files} /> : <FileGridView files={files} />}
      </div>
    </div>
  );
}
