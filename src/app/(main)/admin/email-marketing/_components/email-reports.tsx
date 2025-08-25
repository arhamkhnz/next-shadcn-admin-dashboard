"use client";

import { useState } from "react";

import { Calendar, Download, Filter } from "lucide-react";
import { Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Cell } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const reportData = [
  {
    id: "1",
    campaign: "Summer Special Offer",
    sent: 12400,
    opens: 5282,
    clicks: 2255,
    conversions: 126,
    revenue: 12500,
    openRate: 42.6,
    clickRate: 18.2,
    conversionRate: 5.1,
    date: "2024-06-16",
  },
  {
    id: "2",
    campaign: "New Service Launch",
    sent: 8900,
    opens: 0,
    clicks: 0,
    conversions: 0,
    revenue: 0,
    openRate: 0,
    clickRate: 0,
    conversionRate: 0,
    date: "2024-06-05",
  },
  {
    id: "3",
    campaign: "Customer Loyalty Program",
    sent: 0,
    opens: 0,
    clicks: 0,
    conversions: 0,
    revenue: 0,
    openRate: 0,
    clickRate: 0,
    conversionRate: 0,
    date: "2024-06-10",
  },
  {
    id: "4",
    campaign: "End of Year Sale",
    sent: 15600,
    opens: 5959,
    clicks: 2449,
    conversions: 156,
    revenue: 9800,
    openRate: 38.2,
    clickRate: 15.7,
    conversionRate: 4.8,
    date: "2023-12-15",
  },
];

const openRateData = [
  { date: "Jan", rate: 32 },
  { date: "Feb", rate: 41 },
  { date: "Mar", rate: 38 },
  { date: "Apr", rate: 45 },
  { date: "May", rate: 42 },
  { date: "Jun", rate: 48 },
];

const clickRateData = [
  { date: "Jan", rate: 12 },
  { date: "Feb", rate: 15 },
  { date: "Mar", rate: 14 },
  { date: "Apr", rate: 18 },
  { date: "May", rate: 16 },
  { date: "Jun", rate: 20 },
];

const campaignStatusData = [
  { name: "Sent", value: 12 },
  { name: "Scheduled", value: 3 },
  { name: "Draft", value: 5 },
];

export function EmailReports() {
  const [dateRange, setDateRange] = useState("last30days");
  const [campaignFilter, setCampaignFilter] = useState("all");

  const handleExport = (format: string) => {
    // In a real app, this would export the report data
    console.log(`Exporting report as ${format}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Email Reports</h2>
          <p className="text-muted-foreground">Detailed analytics and performance reports for your email campaigns</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="text-muted-foreground h-4 w-4" />
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7days">Last 7 days</SelectItem>
                <SelectItem value="last30days">Last 30 days</SelectItem>
                <SelectItem value="last90days">Last 90 days</SelectItem>
                <SelectItem value="thisyear">This year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-muted-foreground h-4 w-4" />
            <Select value={campaignFilter} onValueChange={setCampaignFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by campaign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All campaigns</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport("csv")}>CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("xlsx")}>Excel</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("pdf")}>PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Emails Sent</CardDescription>
            <CardTitle className="text-3xl">28,000</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-xs">+12% from last period</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Open Rate</CardDescription>
            <CardTitle className="text-3xl">40.4%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-xs">+3.1% from last period</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Click Rate</CardDescription>
            <CardTitle className="text-3xl">16.9%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-xs">+1.2% from last period</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-3xl">$22,300</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-xs">+15% from last period</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Open Rate Trend</CardTitle>
            <CardDescription>Monthly open rate performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={openRateData}>
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Click Rate Trend</CardTitle>
            <CardDescription>Monthly click rate performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={clickRateData}>
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Line type="monotone" dataKey="rate" stroke="hsl(var(--secondary))" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>Detailed metrics for each campaign</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Opens</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Conversions</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Open Rate</TableHead>
                <TableHead>Click Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.campaign}</TableCell>
                  <TableCell>{report.sent.toLocaleString()}</TableCell>
                  <TableCell>{report.opens.toLocaleString()}</TableCell>
                  <TableCell>{report.clicks.toLocaleString()}</TableCell>
                  <TableCell>{report.conversions.toLocaleString()}</TableCell>
                  <TableCell>${report.revenue.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{report.openRate}%</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{report.clickRate}%</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
