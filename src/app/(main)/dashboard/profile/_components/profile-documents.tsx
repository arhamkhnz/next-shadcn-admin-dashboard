import { Fragment } from "react";

import { Download, FileText, LockKeyhole } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";

import type { ProfileDocument } from "./profile-data";

export function ProfileDocuments({ documents }: { documents: ProfileDocument[] }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="font-heading font-medium text-base leading-none">Documents</h2>
          <p className="text-muted-foreground text-sm">Files attached to this employee record</p>
        </div>
        <Button size="sm">
          <FileText data-icon="inline-start" />
          Add document
        </Button>
      </div>
      <ItemGroup className="gap-0 border-y">
        {documents.map((document, index) => (
          <Fragment key={document.id}>
            <Item className="rounded-none px-2 py-3" role="listitem">
              <ItemContent>
                <ItemTitle>{document.name}</ItemTitle>
                <ItemDescription>
                  {document.category} · Updated {document.updated}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge className="rounded-sm" variant="outline">
                  {document.status}
                </Badge>
                {document.restricted ? (
                  <span
                    aria-label={`${document.name} is restricted`}
                    className="inline-flex size-8 items-center justify-center text-muted-foreground"
                    role="img"
                    title="Restricted"
                  >
                    <LockKeyhole className="size-4" />
                  </span>
                ) : (
                  <Button aria-label={`Download ${document.name}`} size="icon-sm" variant="ghost">
                    <Download />
                  </Button>
                )}
              </ItemActions>
            </Item>
            {index < documents.length - 1 && <ItemSeparator className="my-0" />}
          </Fragment>
        ))}
      </ItemGroup>
    </div>
  );
}
