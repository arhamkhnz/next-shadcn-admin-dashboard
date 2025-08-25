/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable complexity */

"use client";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Mail, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useEmailMarketingStore } from "@/stores/admin-dashboard/email-marketing-store";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Campaign name must be at least 2 characters.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  content: z.string().min(10, {
    message: "Email content must be at least 10 characters.",
  }),
  recipients: z.string().min(1, {
    message: "Please select recipient criteria.",
  }),
  sendDate: z.date({
    required_error: "A send date is required.",
  }),
});

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign?: any;
}

export function CreateCampaignDialog({ open, onOpenChange, campaign }: CreateCampaignDialogProps) {
  const { createCampaign, updateCampaign } = useEmailMarketingStore();
  const [date, setDate] = useState<Date>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: campaign?.name ?? "",
      subject: campaign?.subject ?? "",
      content: campaign?.content ?? "",
      recipients: campaign?.recipients ?? "",
      sendDate: campaign?.sendDate ?? new Date(),
    },
  });

  useEffect(() => {
    if (campaign) {
      form.reset({
        name: campaign.name ?? "",
        subject: campaign.subject ?? "",
        content: campaign.content ?? "",
        recipients: campaign.recipients ?? "",
        sendDate: campaign.scheduledAt ?? campaign.sendDate ?? new Date(),
      });
    }
  }, [campaign, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (campaign) {
        await updateCampaign({
          id: campaign.id,
          name: values.name,
          subject: values.subject,
          content: values.content,
          scheduledAt: values.sendDate,
        });
        toast.success("Campaign updated successfully!");
      } else {
        await createCampaign({
          name: values.name,
          subject: values.subject,
          content: values.content,
          recipients: 12450, // Mock value
          scheduledAt: values.sendDate,
          openRate: 0,
          clickRate: 0,
        });
        toast.success("Campaign created successfully!");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to save campaign. Please try again.");
      console.error("Error saving campaign:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{campaign ? "Edit" : "Create"} Campaign</DialogTitle>
          <DialogDescription>
            {campaign
              ? "Make changes to your email campaign."
              : "Create a new email campaign to engage your customers."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Summer Special Offer" {...field} />
                      </FormControl>
                      <FormDescription>This is the internal name for your campaign.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject Line</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Exclusive offer just for you!" {...field} />
                      </FormControl>
                      <FormDescription>This is what recipients will see in their inbox.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recipients"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipients</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2 rounded-md border p-3">
                          <Users className="text-muted-foreground h-4 w-4" />
                          <span>All Users (12,450)</span>
                        </div>
                      </FormControl>
                      <FormDescription>Select who will receive this email.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sendDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Send Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>Schedule when this campaign should be sent.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Content</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Write your email content here..." className="min-h-[300px]" {...field} />
                      </FormControl>
                      <FormDescription>The main content of your email.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{campaign ? "Update" : "Create"} Campaign</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
