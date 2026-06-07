import type { LucideIcon } from "lucide-react";
import { Clock3, Inbox, Mail, MessageCircle, Phone, Send, Star, User } from "lucide-react";

export type Conversation = {
  id: number;
  group: "Pinned" | "Today" | "Yesterday";
  name: string;
  subject: string;
  preview: string;
  time: string;
  isUnread: boolean;
  isOnline: boolean;
};

export type Message = {
  id: number;
  side: "in" | "out";
  text: string;
  time: string;
};

export type Contact = {
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  timezone: string;
  status: string;
  qualifiedAt: string;
  tags: string[];
};

export type NavItem = {
  id: string;
  title: string;
  label?: string;
  icon: LucideIcon;
  isActive: boolean;
};

export type ChannelItem = NavItem;

export type ViewItem = NavItem;

export const navItems: NavItem[] = [
  { id: "inbox", title: "Inbox", label: "24", icon: Inbox, isActive: true },
  { id: "mentions", title: "Mentions", label: "3", icon: Mail, isActive: false },
  { id: "snoozed", title: "Snoozed", icon: Clock3, isActive: false },
  { id: "sent", title: "Sent", icon: Send, isActive: false },
  { id: "all", title: "All conversations", icon: MessageCircle, isActive: false },
  { id: "unassigned", title: "Unassigned", label: "7", icon: User, isActive: false },
];

export const channelItems: ChannelItem[] = [
  { id: "email", title: "Email", label: "18", icon: Mail, isActive: false },
  { id: "chat", title: "Chat", label: "5", icon: MessageCircle, isActive: false },
  { id: "whatsapp", title: "WhatsApp", label: "1", icon: Phone, isActive: false },
  { id: "instagram", title: "Instagram", label: "0", icon: Phone, isActive: false },
  { id: "facebook", title: "Facebook", label: "0", icon: Phone, isActive: false },
  { id: "phone", title: "Phone", label: "0", icon: Phone, isActive: false },
];

export const viewItems: ViewItem[] = [
  { id: "vip", title: "VIP Customers", label: "8", icon: Star, isActive: false },
  { id: "orders", title: "Orders & Returns", label: "6", icon: Inbox, isActive: false },
  { id: "feedback", title: "Product Feedback", label: "2", icon: MessageCircle, isActive: false },
];

export const conversations: Conversation[] = [
  // Pinned
  {
    id: 1,
    group: "Pinned",
    name: "Wendy Chen",
    subject: "Deployment pipeline failing on staging since last deploy",
    preview: "We're seeing 502 errors after the latest build went out. Rollback didn't help.",
    time: "Just now",
    isUnread: true,
    isOnline: true,
  },
  {
    id: 2,
    group: "Pinned",
    name: "Marcus Rivera",
    subject: "Refund for order #8823 — double charged",
    preview: "I was billed twice on the 3rd. Can someone look into this and reverse the duplicate?",
    time: "5m",
    isUnread: false,
    isOnline: true,
  },
  {
    id: 3,
    group: "Pinned",
    name: "Priya Sharma",
    subject: "Access to analytics dashboard — permissions issue",
    preview: "I'm getting a 403 since the role update yesterday. Tried clearing cache already.",
    time: "8m",
    isUnread: true,
    isOnline: false,
  },
  {
    id: 4,
    group: "Pinned",
    name: "David Okonkwo",
    subject: "Proposal draft for Q3 partnership",
    preview: "Attached the revised MOU with the updated revenue split. Legal needs to sign off.",
    time: "22m",
    isUnread: false,
    isOnline: true,
  },
  // Today
  {
    id: 5,
    group: "Today",
    name: "Fatima Al-Rashid",
    subject: "Sustainability report inquiry",
    preview: "Hi team, I'm looking for the latest ESG disclosure for our upcoming board meeting.",
    time: "10:42 AM",
    isUnread: true,
    isOnline: true,
  },
  {
    id: 6,
    group: "Today",
    name: "Jake Morrison",
    subject: "Bulk export keeps timing out",
    preview: "Tried three times this morning. It gets to about 60% then throws a gateway error.",
    time: "10:15 AM",
    isUnread: false,
    isOnline: false,
  },
  {
    id: 7,
    group: "Today",
    name: "Camille Dupont",
    subject: "Invoice INV-4821 still marked unpaid",
    preview: "Our payment cleared on Friday — screenshot of the confirmation attached here.",
    time: "9:58 AM",
    isUnread: true,
    isOnline: true,
  },
  {
    id: 8,
    group: "Today",
    name: "Ravi Krishnamurthy",
    subject: "Onboarding docs for new hire — where to start?",
    preview: "Got a new backend dev starting Monday. Need the standard checklist and repo access steps.",
    time: "9:32 AM",
    isUnread: false,
    isOnline: true,
  },
  {
    id: 9,
    group: "Today",
    name: "Nina Johansson",
    subject: "Downgrade from Enterprise to Pro plan",
    preview: "We're winding down the project at end of quarter. Is there an early termination fee?",
    time: "9:12 AM",
    isUnread: false,
    isOnline: false,
  },
  {
    id: 10,
    group: "Today",
    name: "Tomas Gutierrez",
    subject: "API rate limit hitting hard during peak",
    preview: "Our batch jobs are getting 429s every 15 minutes between 9 and 11 AM. Need a bump.",
    time: "8:47 AM",
    isUnread: true,
    isOnline: true,
  },
  {
    id: 11,
    group: "Today",
    name: "Lena Park",
    subject: "Custom domain SSL cert expired overnight",
    preview: "Users are seeing certificate warnings when they hit our shop page. This is urgent.",
    time: "8:05 AM",
    isUnread: true,
    isOnline: false,
  },
  {
    id: 12,
    group: "Today",
    name: "Omar Hassan",
    subject: "Upgrade to annual billing — is there a discount?",
    preview: "We're ready to commit for the year. Can you send over the annual pricing sheet?",
    time: "7:38 AM",
    isUnread: false,
    isOnline: true,
  },
  {
    id: 13,
    group: "Today",
    name: "Sophie Lambert",
    subject: "Bug: date picker off by one in reports",
    preview: "Selecting June 5 produces June 4 in the CSV export. Screenshot attached for reference.",
    time: "6:52 AM",
    isUnread: false,
    isOnline: false,
  },
  {
    id: 14,
    group: "Today",
    name: "Andre Briggs",
    subject: "Webhook delivery failures for Zapier integration",
    preview: "Getting intermittent 500s on the webhook endpoint since roughly 2 AM UTC. Logs linked.",
    time: "6:10 AM",
    isUnread: true,
    isOnline: true,
  },
  {
    id: 15,
    group: "Today",
    name: "Yuki Tanaka",
    subject: "Request: granular RBAC for team leads",
    preview: "Our engineering leads need read-only on production but full write access on staging.",
    time: "5:44 AM",
    isUnread: false,
    isOnline: false,
  },
  {
    id: 16,
    group: "Today",
    name: "Clara Mbatha",
    subject: "Mobile app crashes on Android 14 after update",
    preview: "Three users reported the same crash on launch. Stack trace from Firebase attached.",
    time: "5:18 AM",
    isUnread: true,
    isOnline: true,
  },
  // Yesterday
  {
    id: 17,
    group: "Yesterday",
    name: "Benicio Torres",
    subject: "Partnership proposal for Latin American market",
    preview: "We're expanding into Mexico and Brazil next quarter. Would love to explore a reseller deal.",
    time: "Yesterday",
    isUnread: false,
    isOnline: false,
  },
  {
    id: 18,
    group: "Yesterday",
    name: "Anya Petrova",
    subject: "Data export — need all logs from May",
    preview: "Our compliance audit starts next week. I need a full activity log dump for the auditors.",
    time: "Yesterday",
    isUnread: false,
    isOnline: true,
  },
  {
    id: 19,
    group: "Yesterday",
    name: "Kwame Asante",
    subject: "White-label options for our reseller program",
    preview: "We have five partners asking about branded dashboards. Do you offer white-label tiers?",
    time: "Yesterday",
    isUnread: true,
    isOnline: true,
  },
  {
    id: 20,
    group: "Yesterday",
    name: "Rosa Mendez",
    subject: "MFA enforcement rollout — questions",
    preview: "Our security team wants to know if SMS fallback is still supported after the enforcement date.",
    time: "Yesterday",
    isUnread: false,
    isOnline: false,
  },
  {
    id: 21,
    group: "Yesterday",
    name: "Henrik Larsson",
    subject: "Missing line items in CSV export",
    preview: "The January invoice export is short by three line items. The PDF version is correct though.",
    time: "Yesterday",
    isUnread: false,
    isOnline: true,
  },
  {
    id: 22,
    group: "Yesterday",
    name: "Amara Obi",
    subject: "Demo request for procurement team — Friday",
    preview: "Need a 30-minute walkthrough of the vendor portal for our finance leads this Friday.",
    time: "Yesterday",
    isUnread: true,
    isOnline: false,
  },
  {
    id: 23,
    group: "Yesterday",
    name: "Dmitri Volkov",
    subject: "SSO integration with Azure AD",
    preview: "We're migrating from Okta to Azure AD. What's the typical setup timeline for SSO?",
    time: "Yesterday",
    isUnread: false,
    isOnline: true,
  },
  {
    id: 24,
    group: "Yesterday",
    name: "Chloe Boudreaux",
    subject: "Cancellation request — account owner left",
    preview: "Our ops lead resigned last week. Need to transfer ownership to me before we can cancel.",
    time: "Yesterday",
    isUnread: true,
    isOnline: false,
  },
];

export const messages: Message[] = [
  {
    id: 1,
    side: "in",
    text: "Hi team, I'm looking for the latest ESG disclosure report — our board meeting is next Thursday and I need to include your carbon footprint data.",
    time: "10:42 AM",
  },
  {
    id: 2,
    side: "out",
    text: "Hi Fatima! Absolutely, our 2025 sustainability report just went live. I've pulled the executive summary and the detailed carbon accounting section for you.",
    time: "10:44 AM",
  },
  {
    id: 3,
    side: "in",
    text: "Thank you! One follow-up — do you have granular data on Scope 3 emissions? Our investors are pushing hard on supply chain transparency this cycle.",
    time: "10:47 AM",
  },
  {
    id: 4,
    side: "out",
    text: "Yes, we break out Scope 3 by category — purchased goods, logistics, and business travel. I'll attach the raw CSV so your team can run their own analysis.",
    time: "10:49 AM",
  },
  {
    id: 5,
    side: "in",
    text: "Perfect, that's exactly what I needed. Thanks for the quick turnaround — I'll loop back if the board has follow-ups.",
    time: "10:50 AM",
  },
];

export const activeContact: Contact = {
  name: "Fatima Al-Rashid",
  role: "Director of ESG",
  company: "Amanah Capital",
  email: "fatima@amanahcapital.ae",
  phone: "+971 4 555 8234",
  website: "amanahcapital.ae",
  location: "Dubai, UAE",
  timezone: "GST (UTC+4)",
  status: "Qualified",
  qualifiedAt: "Jan 22, 2026",
  tags: ["Sustainability", "Enterprise", "FinServ"],
};

export const currentUser = {
  name: "Kofi Mensah",
  company: "Nimbus Inc.",
};

export const agentName = "Kofi Mensah";
