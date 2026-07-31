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
  archive: "Archive",
  design: "Design",
  document: "Document",
  pdf: "PDF",
  spreadsheet: "Spreadsheet",
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
    name: "Brand assets",
    fileCount: 24,
    size: "1.8 GB",
    updatedAt: "12 min ago",
  },
  {
    id: "product-design",
    name: "Product design",
    fileCount: 38,
    size: "4.6 GB",
    updatedAt: "Yesterday",
  },
  {
    id: "legal-documents",
    name: "Legal documents",
    fileCount: 16,
    size: "840 MB",
    updatedAt: "Jul 29",
  },
  {
    id: "research",
    name: "Research",
    fileCount: 11,
    size: "620 MB",
    updatedAt: "Jul 27",
  },
  {
    id: "marketing",
    name: "Marketing",
    fileCount: 29,
    size: "2.3 GB",
    updatedAt: "Jul 25",
  },
  {
    id: "team-resources",
    name: "Team resources",
    fileCount: 18,
    size: "1.2 GB",
    updatedAt: "Jul 22",
  },
];

export const files: FileManagerFile[] = [
  {
    id: "product-roadmap",
    name: "Product roadmap 2027.pdf",
    kind: "pdf",
    size: "8.4 MB",
    owner: "Arham Khan",
    ownerInitials: "AK",
    modifiedAt: "5 minutes ago",
    shared: true,
    starred: true,
  },
  {
    id: "design-system",
    name: "Design system foundations.fig",
    kind: "design",
    size: "24.1 MB",
    owner: "Aiy",
    ownerInitials: "AY",
    modifiedAt: "2 hours ago",
    shared: true,
    starred: false,
  },
  {
    id: "campaign-performance",
    name: "Campaign performance.xlsx",
    kind: "spreadsheet",
    size: "2.7 MB",
    owner: "Ammar Khan",
    ownerInitials: "AM",
    modifiedAt: "Yesterday",
    shared: false,
    starred: false,
  },
  {
    id: "research-notes",
    name: "Customer research notes.docx",
    kind: "document",
    size: "1.2 MB",
    owner: "Aiy",
    ownerInitials: "AY",
    modifiedAt: "Jul 29, 2026",
    shared: true,
    starred: true,
  },
  {
    id: "release-assets",
    name: "Release assets.zip",
    kind: "archive",
    size: "186 MB",
    owner: "Arham Khan",
    ownerInitials: "AK",
    modifiedAt: "Jul 28, 2026",
    shared: false,
    starred: false,
  },
  {
    id: "handoff-checklist",
    name: "Handoff checklist.pdf",
    kind: "pdf",
    size: "940 KB",
    owner: "Ammar Khan",
    ownerInitials: "AM",
    modifiedAt: "Jul 26, 2026",
    shared: true,
    starred: false,
  },
  {
    id: "quarterly-budget",
    name: "Quarterly budget forecast.xlsx",
    kind: "spreadsheet",
    size: "3.8 MB",
    owner: "Arham Khan",
    ownerInitials: "AK",
    modifiedAt: "Jul 24, 2026",
    shared: true,
    starred: false,
  },
  {
    id: "mobile-app-prototype",
    name: "Mobile app prototype.fig",
    kind: "design",
    size: "18.6 MB",
    owner: "Ammar Khan",
    ownerInitials: "AM",
    modifiedAt: "Jul 23, 2026",
    shared: true,
    starred: true,
  },
  {
    id: "partnership-agreement",
    name: "Partnership agreement.docx",
    kind: "document",
    size: "620 KB",
    owner: "Ammar Khan",
    ownerInitials: "AM",
    modifiedAt: "Jul 21, 2026",
    shared: false,
    starred: false,
  },
  {
    id: "product-launch-brief",
    name: "Product launch brief.pdf",
    kind: "pdf",
    size: "4.2 MB",
    owner: "Arham Khan",
    ownerInitials: "AK",
    modifiedAt: "Jul 19, 2026",
    shared: true,
    starred: false,
  },
  {
    id: "brand-exports",
    name: "Brand exports.zip",
    kind: "archive",
    size: "72 MB",
    owner: "Arham Khan",
    ownerInitials: "AK",
    modifiedAt: "Jul 17, 2026",
    shared: false,
    starred: false,
  },
];
