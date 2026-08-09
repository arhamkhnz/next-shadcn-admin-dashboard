interface FieldItem {
  label: string;
  value: string;
}

export function FieldGrid({ fields }: { fields: FieldItem[] }) {
  return (
    <dl className="grid sm:grid-cols-2">
      {fields.map((field) => (
        <div className="border-b py-3 sm:even:pl-6 sm:odd:pr-6" key={field.label}>
          <dt className="text-muted-foreground text-xs">{field.label}</dt>
          <dd className="mt-1 text-sm">{field.value}</dd>
        </div>
      ))}
    </dl>
  );
}
