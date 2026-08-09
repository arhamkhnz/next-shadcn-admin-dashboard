import { LockKeyhole, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FieldItem {
  label: string;
  value: string;
}

export function SectionHeader({ title, privateSection = false }: { title: string; privateSection?: boolean }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <h2 className="font-heading font-medium text-base">{title}</h2>
        {privateSection && (
          <Badge variant="outline">
            <LockKeyhole data-icon="inline-start" />
            Private
          </Badge>
        )}
      </div>
      <Button size="sm" variant="ghost">
        <Pencil data-icon="inline-start" />
        Edit
      </Button>
    </div>
  );
}

export function FieldGrid({ fields }: { fields: FieldItem[] }) {
  return (
    <dl className="grid border-t sm:grid-cols-2">
      {fields.map((field) => (
        <div className="border-b py-3 sm:even:pl-6 sm:odd:pr-6" key={field.label}>
          <dt className="text-muted-foreground text-xs">{field.label}</dt>
          <dd className="mt-1 text-sm">{field.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function DetailsPanel({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-4xl py-6">{children}</div>;
}
