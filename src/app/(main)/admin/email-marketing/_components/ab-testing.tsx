"use client";

import { useState } from "react";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const mockTests = [
  {
    id: "1",
    name: "Summer Offer Subject Line",
    status: "completed",
    startDate: "2024-06-01",
    endDate: "2024-06-15",
    variants: [
      { id: "A", name: "50% Off Summer Specials", openRate: 42.5, clickRate: 18.2, conversionRate: 5.1 },
      { id: "B", name: "Exclusive Summer Deals Inside", openRate: 38.7, clickRate: 16.8, conversionRate: 4.7 },
    ],
    winner: "A",
  },
  {
    id: "2",
    name: "Welcome Email Content",
    status: "running",
    startDate: "2024-06-10",
    endDate: "2024-06-25",
    variants: [
      { id: "A", name: "Welcome to Karwi! Get 20% Off", openRate: 35.2, clickRate: 12.4, conversionRate: 3.2 },
      { id: "B", name: "Your First Wash is on Us!", openRate: 37.8, clickRate: 14.1, conversionRate: 3.8 },
    ],
    winner: null,
  },
  {
    id: "3",
    name: "Button Color Test",
    status: "draft",
    startDate: "",
    endDate: "",
    variants: [
      { id: "A", name: "Blue Button", openRate: 0, clickRate: 0, conversionRate: 0 },
      { id: "B", name: "Green Button", openRate: 0, clickRate: 0, conversionRate: 0 },
    ],
    winner: null,
  },
];

const performanceData = [
  { name: "A", open: 42.5, click: 18.2 },
  { name: "B", open: 38.7, click: 16.8 },
];

export function ABTesting() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [testName, setTestName] = useState("");
  const [variantA, setVariantA] = useState("");
  const [variantB, setVariantB] = useState("");

  const handleCreateTest = () => {
    // In a real app, this would create a new A/B test
    console.log("Creating A/B test:", { testName, variantA, variantB });
    setIsCreateDialogOpen(false);
    setTestName("");
    setVariantA("");
    setVariantB("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "running":
        return <Badge variant="default">Running</Badge>;
      case "completed":
        return <Badge variant="default">Completed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>A/B Testing</CardTitle>
            <CardDescription>Test different email variations to optimize performance</CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>Create Test</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New A/B Test</DialogTitle>
                <DialogDescription>Compare two email variants to determine which performs better</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="testName" className="text-right">
                    Test Name
                  </Label>
                  <Input
                    id="testName"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g., Subject Line Test"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="variantA" className="text-right">
                    Variant A
                  </Label>
                  <Textarea
                    id="variantA"
                    value={variantA}
                    onChange={(e) => setVariantA(e.target.value)}
                    className="col-span-3"
                    placeholder="Enter variant A content"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="variantB" className="text-right">
                    Variant B
                  </Label>
                  <Textarea
                    id="variantB"
                    value={variantB}
                    onChange={(e) => setVariantB(e.target.value)}
                    className="col-span-3"
                    placeholder="Enter variant B content"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTest}>Create Test</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Variants</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Winner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTests.map((test) => (
              <TableRow key={test.id}>
                <TableCell className="font-medium">{test.name}</TableCell>
                <TableCell>{getStatusBadge(test.status)}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">
                      <span className="font-medium">A:</span> {test.variants[0].name}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">B:</span> {test.variants[1].name}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {test.status === "completed" || test.status === "running" ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Open Rate</span>
                        <span className="font-medium">
                          A: {test.variants[0].openRate}% | B: {test.variants[1].openRate}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Click Rate</span>
                        <span className="font-medium">
                          A: {test.variants[0].clickRate}% | B: {test.variants[1].clickRate}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Conversion</span>
                        <span className="font-medium">
                          A: {test.variants[0].conversionRate}% | B: {test.variants[1].conversionRate}%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Not started</span>
                  )}
                </TableCell>
                <TableCell>
                  {test.winner ? (
                    <Badge variant="default">Variant {test.winner}</Badge>
                  ) : test.status === "running" ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">Progress</span>
                        <Progress value={65} className="h-2" />
                        <span className="text-xs">65%</span>
                      </div>
                      <span className="text-muted-foreground text-xs">2 days left</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Pending</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-8">
          <h3 className="mb-4 text-lg font-medium">Performance Comparison</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Open Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={performanceData}>
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 50]} />
                    <Bar dataKey="open" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Click Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={performanceData}>
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 25]} />
                    <Bar dataKey="click" fill="hsl(var(--secondary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
