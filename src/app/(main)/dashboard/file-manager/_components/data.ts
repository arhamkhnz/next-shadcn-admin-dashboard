import { File, FileArchive, FileChartColumn, FileImage, FileText } from "lucide-react";

export type FileKind = "document" | "spreadsheet" | "design" | "pdf" | "archive";
export type FileManagerView = "grid" | "list";

export const fileIcons = {
  archive: FileArchive,
  design: FileImage,
  document: FileText,
  pdf: File,
  spreadsheet: FileChartColumn,
} satisfies Record<FileKind, typeof File>;

export const fileKindLabels: Record<FileKind, string> = {
  archive: "Arquivo",
  design: "Design",
  document: "Documento",
  pdf: "PDF",
  spreadsheet: "Planilha",
};

export interface FileManagerFolder {
  id: string;
  name: string;
  fileCount: number;
  size: string;
  updatedAt: string;
}

export interface FileManagerFile {
  id: string;
  name: string;
  kind: FileKind;
  size: string;
  owner: string;
  ownerInitials: string;
  modifiedAt: string;
  shared: boolean;
  starred: boolean;
}

export const folders: FileManagerFolder[] = [
  {
    id: "brand-assets",
    name: "Ativos de marca",
    fileCount: 24,
    size: "1.8 GB",
    updatedAt: "2026-11-09T09:50:00",
  },
  {
    id: "product-design",
    name: "Design de produto",
    fileCount: 38,
    size: "4.6 GB",
    updatedAt: "2026-11-08T16:20:00",
  },
  {
    id: "legal-documents",
    name: "Documentos legais",
    fileCount: 16,
    size: "840 MB",
    updatedAt: "2026-07-29T10:05:00",
  },
  {
    id: "research",
    name: "Pesquisa",
    fileCount: 11,
    size: "620 MB",
    updatedAt: "2026-07-27T14:35:00",
  },
  {
    id: "marketing",
    name: "Marketing",
    fileCount: 29,
    size: "2.3 GB",
    updatedAt: "2026-07-25T09:15:00",
  },
  {
    id: "team-resources",
    name: "Recursos da equipe",
    fileCount: 18,
    size: "1.2 GB",
    updatedAt: "2026-07-22T11:40:00",
  },
];

export const files: FileManagerFile[] = [
  {
    id: "product-roadmap",
    name: "Roadmap de produto 2027.pdf",
    kind: "pdf",
    size: "8.4 MB",
    owner: "Arham Khan",
    ownerInitials: "AK",
    modifiedAt: "2026-11-09T09:55:00",
    shared: true,
    starred: true,
  },
  {
    id: "design-system",
    name: "Fundamentos do design system.fig",
    kind: "design",
    size: "24.1 MB",
    owner: "Aiy",
    ownerInitials: "AY",
    modifiedAt: "2026-11-09T08:10:00",
    shared: true,
    starred: false,
  },
  {
    id: "campaign-performance",
    name: "Desempenho de campanha.xlsx",
    kind: "spreadsheet",
    size: "2.7 MB",
    owner: "Ammar Khan",
    ownerInitials: "AM",
    modifiedAt: "2026-11-08T16:20:00",
    shared: false,
    starred: false,
  },
  {
    id: "research-notes",
    name: "Notas de pesquisa com clientes.docx",
    kind: "document",
    size: "1.2 MB",
    owner: "Aiy",
    ownerInitials: "AY",
    modifiedAt: "2026-07-29T10:05:00",
    shared: true,
    starred: true,
  },
  {
    id: "release-assets",
    name: "Ativos de release.zip",
    kind: "archive",
    size: "186 MB",
    owner: "Arham Khan",
    ownerInitials: "AK",
    modifiedAt: "2026-07-28T13:45:00",
    shared: false,
    starred: false,
  },
  {
    id: "handoff-checklist",
    name: "Checklist de handoff.pdf",
    kind: "pdf",
    size: "940 KB",
    owner: "Ammar Khan",
    ownerInitials: "AM",
    modifiedAt: "2026-07-26T15:30:00",
    shared: true,
    starred: false,
  },
  {
    id: "quarterly-budget",
    name: "Previsão de orçamento trimestral.xlsx",
    kind: "spreadsheet",
    size: "3.8 MB",
    owner: "Arham Khan",
    ownerInitials: "AK",
    modifiedAt: "2026-07-24T09:20:00",
    shared: true,
    starred: false,
  },
  {
    id: "mobile-app-prototype",
    name: "Protótipo de app mobile.fig",
    kind: "design",
    size: "18.6 MB",
    owner: "Ammar Khan",
    ownerInitials: "AM",
    modifiedAt: "2026-07-23T17:10:00",
    shared: true,
    starred: true,
  },
  {
    id: "partnership-agreement",
    name: "Acordo de parceria.docx",
    kind: "document",
    size: "620 KB",
    owner: "Ammar Khan",
    ownerInitials: "AM",
    modifiedAt: "2026-07-21T11:00:00",
    shared: false,
    starred: false,
  },
  {
    id: "product-launch-brief",
    name: "Brief de lançamento de produto.pdf",
    kind: "pdf",
    size: "4.2 MB",
    owner: "Arham Khan",
    ownerInitials: "AK",
    modifiedAt: "2026-07-19T14:25:00",
    shared: true,
    starred: false,
  },
  {
    id: "brand-exports",
    name: "Exportações de marca.zip",
    kind: "archive",
    size: "72 MB",
    owner: "Arham Khan",
    ownerInitials: "AK",
    modifiedAt: "2026-07-17T10:50:00",
    shared: false,
    starred: false,
  },
];
