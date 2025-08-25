"use client";

import { useEffect, useState } from "react";

import { Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Cell } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmailMarketingStore } from "@/stores/admin-dashboard/email-marketing-store";

import { ExportData } from "./export-data";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

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

const emailPerformanceData = [
  { name: "Welcome", open: 45, click: 18 },
  { name: "Promotional", open: 38, click: 15 },
  { name: "Confirmation", open: 42, click: 12 },
  { name: "Feedback", open: 35, click: 10 },
  { name: "Event", open: 40, click: 16 },
];

const campaignStatusData = [
  { name: "Sent", value: 12 },
  { name: "Scheduled", value: 3 },
  { name: "Draft", value: 5 },
];

export function EmailAnalytics() {
  const { fetchAnalytics, analytics } = useEmailMarketingStore();
  const [totalOpens, setTotalOpens] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    if (analytics.length > 0) {
      const opens = analytics.reduce((sum, a) => sum + a.opens, 0);
      const clicks = analytics.reduce((sum, a) => sum + a.clicks, 0);
      const revenue = analytics.reduce((sum, a) => sum + a.revenue, 0);
      setTotalOpens(opens);
      setTotalClicks(clicks);
      setTotalRevenue(revenue);
    }
  }, [analytics]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email Analytics</h2>
          <p className="text-muted-foreground">Track and analyze your email marketing performance</p>
        </div>
        <ExportData />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Opens</CardDescription>
                <CardTitle className="text-3xl">{totalOpens.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground text-xs">+12% from last month</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Clicks</CardDescription>
                <CardTitle className="text-3xl">{totalClicks.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground text-xs">+8% from last month</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Revenue Generated</CardDescription>
                <CardTitle className="text-3xl">${totalRevenue.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground text-xs">+15% from last month</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Email Performance</CardTitle>
              <CardDescription>Open and click rates by email type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={emailPerformanceData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar dataKey="open" fill="hsl(var(--primary))" name="Open Rate" />
                  <Bar dataKey="click" fill="hsl(var(--secondary))" name="Click Rate" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Engagement Trends</CardTitle>
              <CardDescription>Monthly open and click rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 text-sm font-medium">Open Rate</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={openRateData}>
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Line
                        type="monotone"
                        dataKey="rate"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium">Click Rate</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={clickRateData}>
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Line
                        type="monotone"
                        dataKey="rate"
                        stroke="hsl(var(--secondary))"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Status Distribution</CardTitle>
              <CardDescription>Breakdown of campaign statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={campaignStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {campaignStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Templates</CardTitle>
              <CardDescription>Email templates with highest engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Welcome Email</p>
                    <p className="text-muted-foreground text-sm">Onboarding</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">45.2%</p>
                    <p className="text-muted-foreground text-sm">Open Rate</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Promotional Offer</p>
                    <p className="text-muted-foreground text-sm">Marketing</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">38.7%</p>
                    <p className="text-muted-foreground text-sm">Open Rate</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Special Event Invitation</p>
                    <p className="text-muted-foreground text-sm">Event</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">40.1%</p>
                    <p className="text-muted-foreground text-sm">Open Rate</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Customer Feedback Request</p>
                    <p className="text-muted-foreground text-sm">Engagement</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">35.8%</p>
                    <p className="text-muted-foreground text-sm">Open Rate</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Metrics</CardTitle>
              <CardDescription>Email delivery performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Rate</span>
                  <span className="font-medium">98.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bounce Rate</span>
                  <span className="font-medium">1.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Unsubscribe Rate</span>
                  <span className="font-medium">0.4%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Spam Complaints</span>
                  <span className="font-medium">0.1%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
