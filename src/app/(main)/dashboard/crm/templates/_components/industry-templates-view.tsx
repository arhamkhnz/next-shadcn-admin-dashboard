"use client";

import * as React from "react";

import { Check, ChevronRight, Layers3, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { IndustryTemplateDefinition } from "@/lib/crm-table-engine/crm-config-store";
import { INDUSTRY_TEMPLATES } from "@/lib/crm-table-engine/industry-templates";
import type { CrmEntityType } from "@/lib/crm-table-engine/types";
import { useCrmConfigStore } from "@/lib/crm-table-engine/use-crm-config-store";

function SummaryRow({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="space-y-2">
      <p className="font-medium text-sm">{label}</p>
      {items.length > 0 ? (
        <ul className="space-y-1 text-muted-foreground text-sm">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground text-sm">None</p>
      )}
    </div>
  );
}

export function IndustryTemplatesView() {
  const store = useCrmConfigStore();
  const [selectedId, setSelectedId] = React.useState(INDUSTRY_TEMPLATES[0]?.id ?? "");
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const selectedTemplate: IndustryTemplateDefinition =
    INDUSTRY_TEMPLATES.find((template) => template.id === selectedId) ?? INDUSTRY_TEMPLATES[0];
  const preview = store.getIndustryTemplatePreview(selectedTemplate);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Layers3 className="size-4" />
          CRM configuration
        </div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <h1 className="font-semibold text-2xl tracking-tight">Industry Templates</h1>
            <p className="max-w-3xl text-muted-foreground">
              Frontend-only mock configuration for reusable CRM industry presets. Templates only add missing fields,
              labels, pipeline stages, and saved views.
            </p>
          </div>
          <Badge variant="outline" className="h-7">
            Mock configuration only
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {INDUSTRY_TEMPLATES.map((template) => (
          <Card
            key={template.id}
            className={template.id === selectedTemplate.id ? "border-primary/40 shadow-sm" : undefined}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2 text-base">
                {template.name}
                {template.id === selectedTemplate.id ? <Sparkles className="size-4 text-primary" /> : null}
              </CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                <span className="font-medium text-foreground">Main use case: </span>
                {template.useCase}
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                {template.entitiesAffected.map((entity: CrmEntityType) => (
                  <Badge key={entity} variant="secondary" className="capitalize">
                    {entity}
                  </Badge>
                ))}
              </div>
              <p className="text-muted-foreground text-sm">{template.fieldsIncluded} example fields included</p>
              <Button variant="outline" className="w-full justify-between" onClick={() => setSelectedId(template.id)}>
                View summary
                <ChevronRight className="size-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Apply {selectedTemplate.name}</CardTitle>
          <CardDescription>
            Review the changes before applying. Existing user-created fields, records, and values remain intact.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <SummaryRow
              label="Fields to add"
              items={preview.fieldsToAdd.map((field) => `${field.entityType}: ${field.displayLabel} (${field.type})`)}
            />
            <SummaryRow
              label="Labels to change"
              items={preview.labelsToChange.map(
                (label) => `${label.entityType}: ${label.singularLabel} / ${label.pluralLabel}`,
              )}
            />
            <SummaryRow
              label="Pipeline stages to add"
              items={preview.pipelineStagesToAdd.map((stage) => `${stage.label} (${stage.probability}%)`)}
            />
            <SummaryRow
              label="Saved views to add"
              items={preview.savedViewsToAdd.map((view) => `${view.entityType}: ${view.name}`)}
            />
          </div>
          <Separator />
          <Button onClick={() => setConfirmOpen(true)}>Review and apply template</Button>
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Apply {selectedTemplate.name} template?</DialogTitle>
            <DialogDescription>
              This frontend mock action will only add missing items and keep all existing records and user-created
              configuration.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <p>
              Fields to add: <span className="font-medium text-foreground">{preview.fieldsToAdd.length}</span>
            </p>
            <p>
              Labels to change: <span className="font-medium text-foreground">{preview.labelsToChange.length}</span>
            </p>
            <p>
              Pipeline stages to add:{" "}
              <span className="font-medium text-foreground">{preview.pipelineStagesToAdd.length}</span>
            </p>
            <p>
              Saved views to add: <span className="font-medium text-foreground">{preview.savedViewsToAdd.length}</span>
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                store.applyIndustryTemplate(selectedTemplate);
                setConfirmOpen(false);
                toast(`${selectedTemplate.name} applied`, {
                  description: "Missing fields, labels, stages, and views were added without touching existing data.",
                });
              }}
            >
              <Check className="size-4" />
              Apply template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
