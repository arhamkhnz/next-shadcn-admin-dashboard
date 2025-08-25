"use client";

import { useEffect, useState } from "react";

import { BarChart, Calendar, FileText, Mail, Target, TrendingUp, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEmailMarketingStore } from "@/stores/admin-dashboard/email-marketing-store";

import { ABTesting } from "./ab-testing";
import { CampaignsList } from "./campaigns-list";
import { CreateCampaignDialog } from "./create-campaign-dialog";
import { EmailAnalytics } from "./email-analytics";
import { EmailTemplates } from "./email-templates";
import { UserSegmentation } from "./user-segmentation";

export function EmailMarketingDashboard() {
  const [activeTab, setActiveTab] = useState("campaigns");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { campaigns, fetchCampaigns, templates, fetchTemplates } = useEmailMarketingStore();

  useEffect(() => {
    fetchCampaigns();
    fetchTemplates();
  }, [fetchCampaigns, fetchTemplates]);

  // Calculate metrics
  const totalCampaigns = campaigns.length;
  const scheduledCampaigns = campaigns.filter((c) => c.status === "scheduled").length;

  // Calculate average open rate
  const sentCampaigns = campaigns.filter((c) => c.status === "sent");
  const avgOpenRate =
    sentCampaigns.length > 0 ? sentCampaigns.reduce((sum, c) => sum + c.openRate, 0) / sentCampaigns.length : 0;

  // Calculate average click rate
  const avgClickRate =
    sentCampaigns.length > 0 ? sentCampaigns.reduce((sum, c) => sum + c.clickRate, 0) / sentCampaigns.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Marketing</h1>
          <p className="text-muted-foreground">Create, send, and analyze email campaigns to engage your customers.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Mail className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Mail className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCampaigns}</div>
            <p className="text-muted-foreground text-xs">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgOpenRate.toFixed(1)}%</div>
            <p className="text-muted-foreground text-xs">+3.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <BarChart className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgClickRate.toFixed(1)}%</div>
            <p className="text-muted-foreground text-xs">+1.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledCampaigns}</div>
            <p className="text-muted-foreground text-xs">Campaigns pending</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="segments" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Segments
          </TabsTrigger>
          <TabsTrigger value="ab-testing" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            A/B Testing
          </TabsTrigger>
        </TabsList>
        <TabsContent value="campaigns" className="mt-4 space-y-4">
          <CampaignsList />
        </TabsContent>
        <TabsContent value="templates" className="mt-4 space-y-4">
          <EmailTemplates />
        </TabsContent>
        <TabsContent value="analytics" className="mt-4 space-y-4">
          <EmailAnalytics />
        </TabsContent>
        <TabsContent value="segments" className="mt-4 space-y-4">
          <UserSegmentation />
        </TabsContent>
        <TabsContent value="ab-testing" className="mt-4 space-y-4">
          <ABTesting />
        </TabsContent>
      </Tabs>

      <CreateCampaignDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>
  );
}
