export function AddressBlock({ label, name, lines }: { label: string; name: string; lines: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">{label}</p>
      <div className="flex flex-col gap-1">
        <p className="font-semibold">{name}</p>
        {lines.map((line) => (
          <p key={line} className="text-muted-foreground text-sm leading-relaxed">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
