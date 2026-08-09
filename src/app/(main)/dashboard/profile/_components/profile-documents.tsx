import { Download, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import type { ProfileDocument } from "./profile-data";
import { DetailsPanel } from "./profile-fields";

export function ProfileDocuments({ documents }: { documents: ProfileDocument[] }) {
  return (
    <DetailsPanel>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-medium text-base">Documents</h2>
          <p className="mt-0.5 text-muted-foreground text-sm">Files attached to this employee record</p>
        </div>
        <Button size="sm">
          <FileText data-icon="inline-start" />
          Add document
        </Button>
      </div>
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Status</TableHead>
              <TableHead aria-label="Actions" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((document) => (
              <TableRow key={document.id}>
                <TableCell className="font-medium">{document.name}</TableCell>
                <TableCell>{document.category}</TableCell>
                <TableCell>{document.updated}</TableCell>
                <TableCell>
                  <Badge variant="outline">{document.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button aria-label={`Download ${document.name}`} size="icon-sm" variant="ghost">
                    <Download />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DetailsPanel>
  );
}
