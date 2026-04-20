import { ListFilter } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const opportunities = [
  {
    id: "OP-1842",
    account: "Northstar Retail",
    stage: "Proposal Sent",
    owner: "Maya Patel",
    value: "$42,000",
    nextStep: "Pricing review",
  },
  {
    id: "OP-1836",
    account: "Harbor Health",
    stage: "Discovery",
    owner: "Aisha Khan",
    value: "$18,500",
    nextStep: "Intro call",
  },
  {
    id: "OP-1829",
    account: "Summit Works",
    stage: "Negotiation",
    owner: "Jordan Lee",
    value: "$63,000",
    nextStep: "Legal approval",
  },
  {
    id: "OP-1817",
    account: "Pioneer Freight",
    stage: "Qualified",
    owner: "Eddie Lake",
    value: "$26,400",
    nextStep: "Needs analysis",
  },
  {
    id: "OP-1804",
    account: "Atlas Energy",
    stage: "Proposal Sent",
    owner: "Noah Kim",
    value: "$58,900",
    nextStep: "Decision call",
  },
] as const;

function getStageBadge(stage: (typeof opportunities)[number]["stage"]) {
  switch (stage) {
    case "Proposal Sent":
      return "bg-chart-1/12 text-chart-1 border-chart-1/20";
    case "Negotiation":
      return "bg-chart-2/12 text-chart-2 border-chart-2/20";
    case "Discovery":
      return "bg-primary/10 text-primary border-primary/15";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

export function OpportunitiesSection() {
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>Recent Opportunities</CardTitle>
          <CardDescription>
            Track qualified leads moving through discovery, proposal, and closing stages.
          </CardDescription>
          <CardAction>
            <div className="flex items-center gap-2">
              <Input className="w-44 md:w-52" placeholder="Search deals..." />
              <Button variant="outline" size="sm">
                <ListFilter data-icon="inline-start" />
                Filter
              </Button>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Opportunity</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Next Step</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {opportunities.map((opportunity) => (
                  <TableRow key={opportunity.id}>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <div className="font-medium">{opportunity.account}</div>
                        <div className="text-muted-foreground text-xs">{opportunity.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStageBadge(opportunity.stage)}>
                        {opportunity.stage}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{opportunity.owner}</TableCell>
                    <TableCell className="font-medium tabular-nums">{opportunity.value}</TableCell>
                    <TableCell className="text-muted-foreground">{opportunity.nextStep}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
