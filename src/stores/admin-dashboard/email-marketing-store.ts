/* eslint-disable max-lines */
import { create } from "zustand";

import { emailService } from "@/services/email-service";

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: "draft" | "scheduled" | "sent";
  recipients: number;
  openRate: number;
  clickRate: number;
  createdAt: Date;
  sentAt?: Date;
  scheduledAt?: Date;
}

export interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  content: string;
  used: number;
  lastUsed: Date;
}

export interface EmailAnalytics {
  id: string;
  campaignId: string;
  opens: number;
  clicks: number;
  unsubscribes: number;
  bounces: number;
  complaints: number;
  revenue: number;
  createdAt: Date;
}

interface EmailMarketingState {
  campaigns: EmailCampaign[];
  templates: EmailTemplate[];
  analytics: EmailAnalytics[];
  fetchCampaigns: () => Promise<void>;
  fetchTemplates: () => Promise<void>;
  fetchAnalytics: () => Promise<void>;
  createCampaign: (campaign: Omit<EmailCampaign, "id" | "createdAt" | "status">) => Promise<void>;
  updateCampaign: (campaign: Partial<EmailCampaign> & { id: string }) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
  sendCampaign: (id: string) => Promise<void>;
  scheduleCampaign: (id: string, date: Date) => Promise<void>;
  createTemplate: (template: Omit<EmailTemplate, "id" | "used" | "lastUsed">) => Promise<void>;
  updateTemplate: (template: Partial<EmailTemplate> & { id: string }) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  duplicateTemplate: (id: string) => Promise<void>;
  getTemplateById: (id: string) => EmailTemplate | undefined;
  getCampaignById: (id: string) => EmailCampaign | undefined;
  getAnalyticsByCampaignId: (campaignId: string) => EmailAnalytics | undefined;
}

export const useEmailMarketingStore = create<EmailMarketingState>((set, get) => ({
  campaigns: [],
  templates: [],
  analytics: [],

  fetchCampaigns: async () => {
    // In a real app, this would fetch from an API
    // For now, we'll use mock data
    const mockCampaigns: EmailCampaign[] = [
      {
        id: "1",
        name: "Summer Special Offer",
        subject: "Exclusive Summer Deals Just For You!",
        content: "Check out our amazing summer offers...",
        status: "sent",
        recipients: 12400,
        openRate: 42.6,
        clickRate: 18.2,
        createdAt: new Date(2024, 5, 15),
        sentAt: new Date(2024, 5, 16),
      },
      {
        id: "2",
        name: "New Service Launch",
        subject: "Introducing Our New Premium Wash Service",
        content: "We're excited to announce our new premium wash service...",
        status: "scheduled",
        recipients: 8900,
        openRate: 0,
        clickRate: 0,
        createdAt: new Date(2024, 6, 1),
        scheduledAt: new Date(2024, 6, 5),
      },
      {
        id: "3",
        name: "Customer Loyalty Program",
        subject: "Join Our Exclusive Loyalty Program",
        content: "Become a member of our loyalty program and enjoy exclusive benefits...",
        status: "draft",
        recipients: 0,
        openRate: 0,
        clickRate: 0,
        createdAt: new Date(2024, 6, 10),
      },
    ];

    set({ campaigns: mockCampaigns });
  },

  fetchTemplates: async () => {
    // In a real app, this would fetch from an API
    // For now, we'll use mock data
    const mockTemplates: EmailTemplate[] = [
      {
        id: "1",
        name: "Welcome Email",
        category: "Onboarding",
        content: "Welcome to our service! We're excited to have you...",
        used: 1240,
        lastUsed: new Date(2024, 5, 15),
      },
      {
        id: "2",
        name: "Promotional Offer",
        category: "Marketing",
        content: "Special offer just for you! Don't miss out...",
        used: 890,
        lastUsed: new Date(2024, 6, 1),
      },
      {
        id: "3",
        name: "Booking Confirmation",
        category: "Transactional",
        content: "Thank you for your booking. Here are the details...",
        used: 5600,
        lastUsed: new Date(2024, 6, 10),
      },
    ];

    set({ templates: mockTemplates });
  },

  fetchAnalytics: async () => {
    // In a real app, this would fetch from an API
    // For now, we'll use mock data
    const mockAnalytics: EmailAnalytics[] = [
      {
        id: "1",
        campaignId: "1",
        opens: 5282,
        clicks: 2255,
        unsubscribes: 12,
        bounces: 45,
        complaints: 2,
        revenue: 12500,
        createdAt: new Date(2024, 5, 16),
      },
      {
        id: "2",
        campaignId: "4",
        opens: 5959,
        clicks: 2449,
        unsubscribes: 8,
        bounces: 32,
        complaints: 1,
        revenue: 9800,
        createdAt: new Date(2023, 11, 15),
      },
    ];

    set({ analytics: mockAnalytics });
  },

  createCampaign: async (campaignData) => {
    const newCampaign: EmailCampaign = {
      id: Math.random().toString(36).substr(2, 9),
      ...campaignData,
      status: "draft",
      createdAt: new Date(),
      openRate: 0,
      clickRate: 0,
    };

    set((state) => ({
      campaigns: [...state.campaigns, newCampaign],
    }));
  },

  updateCampaign: async (campaignData) => {
    set((state) => ({
      campaigns: state.campaigns.map((campaign) =>
        campaign.id === campaignData.id ? { ...campaign, ...campaignData } : campaign,
      ),
    }));
  },

  deleteCampaign: async (id) => {
    set((state) => ({
      campaigns: state.campaigns.filter((campaign) => campaign.id !== id),
    }));
  },

  sendCampaign: async (id) => {
    const campaign = get().campaigns.find((c) => c.id === id);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    try {
      // In a real implementation, this would send the actual email
      // For now, we'll simulate the process using our email service
      console.log(`Sending campaign: ${campaign.name}`);

      // Simulate sending email
      await emailService.sendEmail({
        to: ["customer@example.com"], // In reality, this would be a list of recipients
        from: "noreply@karwi.com",
        subject: campaign.subject,
        html: campaign.content,
      });

      // Update campaign status
      set((state) => ({
        campaigns: state.campaigns.map((c) =>
          c.id === id
            ? {
                ...c,
                status: "sent",
                sentAt: new Date(),
                openRate: Math.floor(Math.random() * 30) + 30, // Random open rate between 30-60
                clickRate: Math.floor(Math.random() * 15) + 10, // Random click rate between 10-25
              }
            : c,
        ),
      }));
    } catch (error) {
      console.error("Failed to send campaign:", error);
      throw error;
    }
  },

  scheduleCampaign: async (id, date) => {
    set((state) => ({
      campaigns: state.campaigns.map((campaign) =>
        campaign.id === id ? { ...campaign, status: "scheduled", scheduledAt: date } : campaign,
      ),
    }));
  },

  createTemplate: async (templateData) => {
    try {
      // In a real implementation, this would create the template using our email service
      const templateId = await emailService.createTemplate({
        name: templateData.name,
        html: templateData.content,
        subject: `Template: ${templateData.name}`,
      });

      const newTemplate: EmailTemplate = {
        id: templateId,
        ...templateData,
        used: 0,
        lastUsed: new Date(),
      };

      set((state) => ({
        templates: [...state.templates, newTemplate],
      }));
    } catch (error) {
      console.error("Failed to create template:", error);
      throw error;
    }
  },

  updateTemplate: async (templateData) => {
    try {
      const template = get().templates.find((t) => t.id === templateData.id);
      if (!template) {
        throw new Error("Template not found");
      }

      // In a real implementation, this would update the template using our email service
      await emailService.updateTemplate({
        id: templateData.id,
        name: templateData.name ?? template.name,
        html: templateData.content ?? template.content,
        subject: `Template: ${templateData.name ?? template.name}`,
      });

      set((state) => ({
        templates: state.templates.map((t) => (t.id === templateData.id ? { ...t, ...templateData } : t)),
      }));
    } catch (error) {
      console.error("Failed to update template:", error);
      throw error;
    }
  },

  deleteTemplate: async (id) => {
    try {
      // In a real implementation, this would delete the template using our email service
      await emailService.deleteTemplate(id);

      set((state) => ({
        templates: state.templates.filter((template) => template.id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete template:", error);
      throw error;
    }
  },

  duplicateTemplate: async (id) => {
    const template = get().templates.find((t) => t.id === id);
    if (template) {
      try {
        // In a real implementation, this would duplicate the template using our email service
        const newTemplateId = await emailService.createTemplate({
          name: `${template.name} (Copy)`,
          html: template.content,
          subject: `Template: ${template.name} (Copy)`,
        });

        const newTemplate: EmailTemplate = {
          ...template,
          id: newTemplateId,
          name: `${template.name} (Copy)`,
          used: 0,
          lastUsed: new Date(),
        };

        set((state) => ({
          templates: [...state.templates, newTemplate],
        }));
      } catch (error) {
        console.error("Failed to duplicate template:", error);
        throw error;
      }
    }
  },

  getTemplateById: (id) => {
    return get().templates.find((template) => template.id === id);
  },

  getCampaignById: (id) => {
    return get().campaigns.find((campaign) => campaign.id === id);
  },

  getAnalyticsByCampaignId: (campaignId) => {
    return get().analytics.find((a) => a.campaignId === campaignId);
  },
}));
