"use client";

import * as React from "react";

import { Archive, ArchiveRestore, BookmarkPlus, Copy, PenLine, RotateCcw, Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { CrmEntityType } from "@/lib/crm-table-engine/types";
import { useCrmConfigStore } from "@/lib/crm-table-engine/use-crm-config-store";

function NamePromptDialog({
  open,
  onOpenChange,
  title,
  description,
  initialName,
  submitLabel,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  initialName?: string;
  submitLabel: string;
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setName(initialName ?? "");
      setError(null);
    }
  }, [open, initialName]);

  function submit() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("View name is required.");
      return;
    }
    onSubmit(trimmed);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <FieldGroup className="gap-2">
          <Field data-invalid={Boolean(error)}>
            <FieldLabel htmlFor="saved-view-name">View Name</FieldLabel>
            <Input
              id="saved-view-name"
              value={name}
              autoFocus
              placeholder="e.g. Enterprise Pipeline"
              aria-invalid={Boolean(error)}
              onChange={(event) => {
                setName(event.target.value);
                setError(null);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  submit();
                }
              }}
            />
            {error ? <FieldError errors={[{ message: error }]} /> : null}
          </Field>
        </FieldGroup>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>{submitLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ViewsMenu({ entityType }: { entityType: CrmEntityType }) {
  const allViews = useCrmConfigStore((s) => s.views);
  const activeId = useCrmConfigStore((s) => s.activeViewIds[entityType]);
  const pluralLabel = useCrmConfigStore((s) => s.terminology[entityType].pluralLabel);
  const store = useCrmConfigStore();

  const activeViews = React.useMemo(
    () => allViews.filter((v) => v.entityType === entityType && !v.archivedAt),
    [allViews, entityType],
  );
  const archivedViews = React.useMemo(
    () => allViews.filter((v) => v.entityType === entityType && v.archivedAt),
    [allViews, entityType],
  );

  const activeView = activeViews.find((view) => view.id === activeId) ?? null;
  const defaultView = activeViews.find((view) => view.isDefault) ?? null;

  const [createOpen, setCreateOpen] = React.useState(false);
  const [renameOpen, setRenameOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-xs" aria-label="Manage saved views">
                <BookmarkPlus className="size-3.5" />
                Views
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Create, rename, duplicate, archive views</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Current View{activeView ? `: ${activeView.name}` : ""}</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => setCreateOpen(true)}>
            <BookmarkPlus className="size-3.5" />
            New View…
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!activeView || activeView.id === defaultView?.id}
            onSelect={() => setRenameOpen(true)}
          >
            <PenLine className="size-3.5" />
            Rename Current…
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!activeView}
            onClick={() => {
              if (!activeView) return;
              const copy = store.duplicateView(activeView.id);
              if (copy) {
                store.setActiveView(entityType, copy.id);
                toast(`Duplicated as “${copy.name}”`, { description: "Adjust its columns and filters freely." });
              }
            }}
          >
            <Copy className="size-3.5" />
            Duplicate Current
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={!activeView || activeView.isDefault}
            onClick={() => {
              if (!activeView) return;
              store.setDefaultView(activeView.id);
              toast(`“${activeView.name}” is now the default view`);
            }}
          >
            <Star className="size-3.5" />
            Set as Default
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!activeView || activeView.isDefault}
            onClick={() => {
              if (!activeView) return;
              const name = activeView.name;
              store.archiveView(activeView.id);
              toast(`“${name}” archived`, { description: "Restore it any time from Views › Restore archived." });
            }}
          >
            <Archive className="size-3.5" />
            Archive Current View
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!defaultView}
            onClick={() => {
              if (!defaultView) return;
              store.resetViewLayout(defaultView.id);
              store.setActiveView(entityType, defaultView.id);
              toast(`Default ${pluralLabel} view restored`, {
                description: "Original columns, widths, sorting, and filters.",
              });
            }}
          >
            <RotateCcw className="size-3.5" />
            Restore Default View
          </DropdownMenuItem>
          {archivedViews.length > 0 ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <ArchiveRestore className="size-3.5" />
                  Restore Archived
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {archivedViews.map((view) => (
                    <DropdownMenuItem
                      key={view.id}
                      onClick={() => {
                        store.restoreView(view.id);
                        toast(`“${view.name}” restored`);
                      }}
                    >
                      {view.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <NamePromptDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="New Saved View"
        description="Starts from your current columns, widths, and sorting. Filters stay empty until you add them."
        submitLabel="Create View"
        onSubmit={(name) => {
          const created = store.createView({ entityType, name });
          if (created) {
            toast(`View “${name}” created`);
          }
        }}
      />
      <NamePromptDialog
        open={renameOpen}
        onOpenChange={setRenameOpen}
        title="Rename View"
        description="Only the visible view name changes."
        initialName={activeView?.name}
        submitLabel="Save Name"
        onSubmit={(name) => {
          if (!activeView) return;
          store.renameView(activeView.id, name);
          toast("View renamed");
        }}
      />
    </>
  );
}
