"use client";

import { useEffect, useState } from "react";

import { format } from "date-fns";
import { BarChart, Calendar, Edit, FileText, Play, Send, SquarePen, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

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
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEmailMarketingStore } from "@/stores/admin-dashboard/email-marketing-store";

import { CampaignDetails } from "./campaign-details";
import { CampaignReport } from "./campaign-report";
import { CreateCampaignDialog } from "./create-campaign-dialog";

export function CampaignsList() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<any>(null);
  const [viewingCampaignId, setViewingCampaignId] = useState<string | null>(null);
  const [isViewing, setIsViewing] = useState(false);
  const [reportingCampaignId, setReportingCampaignId] = useState<string | null>(null);
  const [isReporting, setIsReporting] = useState(false);
  const { campaigns, fetchCampaigns, deleteCampaign, sendCampaign } = useEmailMarketingStore();
  const [isSending, setIsSending] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleEdit = (campaign: any) => {
    setEditingCampaign(campaign);
    setIsCreateDialogOpen(true);
  };

  const handleView = (campaignId: string) => {
    setViewingCampaignId(campaignId);
    setIsViewing(true);
  };

  const handleReport = (campaignId: string) => {
    setReportingCampaignId(campaignId);
    setIsReporting(true);
  };

  const handleSendNow = async (campaignId: string) => {
    setIsSending(campaignId);
    try {
      await sendCampaign(campaignId);
      toast.success("Campaign sent successfully!");
    } catch (error) {
      toast.error("Failed to send campaign. Please try again.");
      console.error("Error sending campaign:", error);
    } finally {
      setIsSending(null);
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Email Campaigns</CardTitle>
            <CardDescription>Manage and track your email marketing campaigns.</CardDescription>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <SquarePen className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Open Rate</TableHead>
              <TableHead>Click Rate</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                <TableCell>{campaign.recipients > 0 ? campaign.recipients.toLocaleString() : "-"}</TableCell>
                <TableCell>{campaign.openRate > 0 ? `${campaign.openRate}%` : "-"}</TableCell>
                <TableCell>{campaign.clickRate > 0 ? `${campaign.clickRate}%` : "-"}</TableCell>
                <TableCell>{format(new Date(campaign.createdAt), "MMM d, yyyy")}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleView(campaign.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      {campaign.status === "sent" && (
                        <DropdownMenuItem onClick={() => handleReport(campaign.id)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Report
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleEdit(campaign)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {campaign.status === "draft" && (
                        <>
                          <DropdownMenuItem
                            onClick={() => handleSendNow(campaign.id)}
                            disabled={isSending === campaign.id}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            {isSending === campaign.id ? "Sending..." : "Send Now"}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            Schedule
                          </DropdownMenuItem>
                        </>
                      )}
                      {campaign.status === "scheduled" && (
                        <DropdownMenuItem
                          onClick={() => handleSendNow(campaign.id)}
                          disabled={isSending === campaign.id}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          {isSending === campaign.id ? "Sending..." : "Send Now"}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600" onClick={() => deleteCampaign(campaign.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <Separator className="my-4" />
      <div className="p-6 pt-0">
        <div className="text-muted-foreground text-xs">
          Showing {campaigns.length} of {campaigns.length} campaigns
        </div>
      </div>
      <CreateCampaignDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} campaign={editingCampaign} />
      {viewingCampaignId && (
        <CampaignDetails campaignId={viewingCampaignId} open={isViewing} onOpenChange={setIsViewing} />
      )}
      {reportingCampaignId && (
        <CampaignReport campaignId={reportingCampaignId} open={isReporting} onOpenChange={setIsReporting} />
      )}
    </Card>
  );
}
