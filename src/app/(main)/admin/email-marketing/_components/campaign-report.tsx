"use client";

import { useEffect, useState } from "react";

import { format } from "date-fns";
import { Bar, BarChart, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useEmailMarketingStore } from "@/stores/admin-dashboard/email-marketing-store";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

interface CampaignReportProps {
  campaignId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CampaignReport({ campaignId, open, onOpenChange }: CampaignReportProps) {
  const { getCampaignById, getAnalyticsByCampaignId } = useEmailMarketingStore();
  const [campaign, setCampaign] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    if (open && campaignId) {
      const campaignData = getCampaignById(campaignId);
      const analyticsData = getAnalyticsByCampaignId(campaignId);
      setCampaign(campaignData);
      setAnalytics(analyticsData);
    }
  }, [open, campaignId, getCampaignById, getAnalyticsByCampaignId]);

  if (!campaign || !analytics) {
    return null;
  }

  // Mock data for charts
  const hourlyData = [
    { hour: "08:00", opens: 120, clicks: 45 },
    { hour: "09:00", opens: 240, clicks: 98 },
    { hour: "10:00", opens: 320, clicks: 142 },
    { hour: "11:00", opens: 280, clicks: 125 },
    { hour: "12:00", opens: 180, clicks: 78 },
    { hour: "13:00", opens: 150, clicks: 65 },
    { hour: "14:00", opens: 210, clicks: 92 },
    { hour: "15:00", opens: 260, clicks: 115 },
    { hour: "16:00", opens: 310, clicks: 140 },
    { hour: "17:00", opens: 270, clicks: 122 },
    { hour: "18:00", opens: 220, clicks: 98 },
    { hour: "19:00", opens: 180, clicks: 75 },
  ];

  const deviceData = [
    { name: "Desktop", value: 45 },
    { name: "Mobile", value: 50 },
    { name: "Tablet", value: 5 },
  ];

  const locationData = [
    { name: "Erbil", value: 35 },
    { name: "Baghdad", value: 30 },
    { name: "Basra", value: 20 },
    { name: "Mosul", value: 15 },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Campaign Report: {campaign.name}</DialogTitle>
          <DialogDescription>
            Detailed performance analysis for campaign sent on {format(campaign.sentAt, "MMMM d, yyyy")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Recipients</CardDescription>
                <CardTitle className="text-3xl">{campaign.recipients.toLocaleString()}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Unique Opens</CardDescription>
                <CardTitle className="text-3xl">{analytics.opens.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground text-sm">{campaign.openRate.toFixed(1)}% open rate</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Clicks</CardDescription>
                <CardTitle className="text-3xl">{analytics.clicks.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground text-sm">{campaign.clickRate.toFixed(1)}% click rate</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Revenue Generated</CardDescription>
                <CardTitle className="text-3xl">${analytics.revenue.toLocaleString()}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Opens and Clicks by Hour</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hourlyData}>
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Bar dataKey="opens" fill="#8884d8" name="Opens" />
                    <Bar dataKey="clicks" fill="#82ca9d" name="Clicks" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={locationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {locationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={hourlyData}>
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Line type="monotone" dataKey="opens" stroke="#8884d8" name="Opens" />
                    <Line type="monotone" dataKey="clicks" stroke="#82ca9d" name="Clicks" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Additional Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Delivery Rate</div>
                  <div className="text-2xl font-bold">98.2%</div>
                  <div className="text-muted-foreground text-xs">220 undelivered</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Bounce Rate</div>
                  <div className="text-2xl font-bold">1.8%</div>
                  <div className="text-muted-foreground text-xs">1.2% hard, 0.6% soft</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Unsubscribe Rate</div>
                  <div className="text-2xl font-bold">0.4%</div>
                  <div className="text-muted-foreground text-xs">50 unsubscribes</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Spam Complaints</div>
                  <div className="text-2xl font-bold">0.1%</div>
                  <div className="text-muted-foreground text-xs">12 complaints</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Links */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="max-w-xs truncate">https://karwi.com/services/premium-wash</div>
                  <div className="flex items-center gap-4">
                    <span>1,240 clicks</span>
                    <span className="font-medium">12.5% CTR</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="max-w-xs truncate">https://karwi.com/book-now</div>
                  <div className="flex items-center gap-4">
                    <span>980 clicks</span>
                    <span className="font-medium">9.8% CTR</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="max-w-xs truncate">https://karwi.com/summer-offer</div>
                  <div className="flex items-center gap-4">
                    <span>756 clicks</span>
                    <span className="font-medium">7.6% CTR</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Close Report</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
