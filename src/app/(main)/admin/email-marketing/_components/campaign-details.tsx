/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable complexity */

"use client";

import { useEffect, useState } from "react";

import { format } from "date-fns";
import { BarChart, Calendar, Mail, MoreHorizontal, Play, Send, SquarePen, TrendingUp } from "lucide-react";
import { toast } from "sonner";

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
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useEmailMarketingStore } from "@/stores/admin-dashboard/email-marketing-store";

import { EmailScheduler } from "./email-scheduler";

interface CampaignDetailsProps {
  campaignId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CampaignDetails({ campaignId, open, onOpenChange }: CampaignDetailsProps) {
  const { getCampaignById, getAnalyticsByCampaignId, sendCampaign, scheduleCampaign } = useEmailMarketingStore();
  const [campaign, setCampaign] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);

  useEffect(() => {
    if (open && campaignId) {
      const campaignData = getCampaignById(campaignId);
      const analyticsData = getAnalyticsByCampaignId(campaignId);
      setCampaign(campaignData);
      setAnalytics(analyticsData);
    }
  }, [open, campaignId, getCampaignById, getAnalyticsByCampaignId]);

  const handleSendNow = async () => {
    if (!campaign) return;

    setIsSending(true);
    try {
      await sendCampaign(campaign.id);
      toast.success("Campaign sent successfully!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to send campaign. Please try again.");
      console.error("Error sending campaign:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSchedule = async (data: any) => {
    if (!campaign) return;

    try {
      const scheduledDate = new Date(`${format(data.sendDate, "yyyy-MM-dd")}T${data.sendTime}`);
      await scheduleCampaign(campaign.id, scheduledDate);
      toast.success("Campaign scheduled successfully!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to schedule campaign. Please try again.");
      console.error("Error scheduling campaign:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "scheduled":
        return <Badge variant="default">Scheduled</Badge>;
      case "sent":
        return <Badge variant="default">Sent</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (!campaign) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle>{campaign.name}</DialogTitle>
                <DialogDescription>{campaign.subject}</DialogDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  {campaign.status === "draft" && (
                    <>
                      <DropdownMenuItem>
                        <SquarePen className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSendNow} disabled={isSending}>
                        <Send className="mr-2 h-4 w-4" />
                        {isSending ? "Sending..." : "Send Now"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setIsSchedulerOpen(true)}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule
                      </DropdownMenuItem>
                    </>
                  )}
                  {campaign.status === "scheduled" && (
                    <DropdownMenuItem onClick={handleSendNow} disabled={isSending}>
                      <Play className="mr-2 h-4 w-4" />
                      {isSending ? "Sending..." : "Send Now"}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Delete Campaign</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </DialogHeader>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-6 md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Email Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="min-h-[200px] rounded-lg border p-4">
                    <div className="prose max-w-none">
                      <p>{campaign.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {campaign.status === "sent" && analytics && (
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>Campaign performance data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                        <TrendingUp className="text-primary h-6 w-6" />
                        <div className="mt-2 text-2xl font-bold">{campaign.openRate}%</div>
                        <div className="text-muted-foreground text-sm">Open Rate</div>
                      </div>
                      <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                        <BarChart className="text-primary h-6 w-6" />
                        <div className="mt-2 text-2xl font-bold">{campaign.clickRate}%</div>
                        <div className="text-muted-foreground text-sm">Click Rate</div>
                      </div>
                      <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                        <Mail className="text-primary h-6 w-6" />
                        <div className="mt-2 text-2xl font-bold">{analytics.opens.toLocaleString()}</div>
                        <div className="text-muted-foreground text-sm">Opens</div>
                      </div>
                      <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                        <Send className="text-primary h-6 w-6" />
                        <div className="mt-2 text-2xl font-bold">${analytics.revenue.toLocaleString()}</div>
                        <div className="text-muted-foreground text-sm">Revenue</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span>{getStatusBadge(campaign.status)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recipients</span>
                    <span>{campaign.recipients.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span>{format(campaign.createdAt, "MMM d, yyyy")}</span>
                  </div>
                  {campaign.sentAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sent</span>
                      <span>{format(campaign.sentAt, "MMM d, yyyy h:mm a")}</span>
                    </div>
                  )}
                  {campaign.scheduledAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Scheduled</span>
                      <span>{format(campaign.scheduledAt, "MMM d, yyyy h:mm a")}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {campaign.status !== "sent" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {campaign.status === "draft" && (
                      <>
                        <Button className="w-full" onClick={handleSendNow} disabled={isSending}>
                          <Send className="mr-2 h-4 w-4" />
                          {isSending ? "Sending..." : "Send Now"}
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => setIsSchedulerOpen(true)}>
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule
                        </Button>
                      </>
                    )}
                    {campaign.status === "scheduled" && (
                      <Button className="w-full" onClick={handleSendNow} disabled={isSending}>
                        <Play className="mr-2 h-4 w-4" />
                        {isSending ? "Sending..." : "Send Now"}
                      </Button>
                    )}
                    <Button variant="outline" className="w-full">
                      <SquarePen className="mr-2 h-4 w-4" />
                      Edit Campaign
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EmailScheduler open={isSchedulerOpen} onOpenChange={setIsSchedulerOpen} onSchedule={handleSchedule} />
    </>
  );
}
