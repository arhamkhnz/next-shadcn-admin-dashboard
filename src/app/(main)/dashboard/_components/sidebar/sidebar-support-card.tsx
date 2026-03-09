import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SidebarSupportCard() {
  return (
    <Card size="sm" className="min-w-0 overflow-hidden shadow-none group-data-[collapsible=icon]:hidden">
      <CardHeader className="min-w-0 px-4">
        <CardTitle className="truncate text-sm">Looking for something more?</CardTitle>
        <CardDescription>Open an issue or do reach out to me.</CardDescription>
      </CardHeader>
    </Card>
  );
}
