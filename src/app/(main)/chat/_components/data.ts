import type { LucideIcon } from "lucide-react";
import { Clock3, Inbox, Mail, MessageCircle, Phone, Send, Star, User } from "lucide-react";

export type Conversation = {
  id: string;
  name: string;
  subject: string;
  preview: string;
  time: string;
  isActive: boolean;
  isUnread: boolean;
};

export type Message = {
  id: string;
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
  {
    id: "conv-1",
    name: "Olivia Martinez",
    subject: "Enterprise plan pricing",
    preview: "Thanks for getting back to me...",
    time: "2m",
    isActive: false,
    isUnread: false,
  },
  {
    id: "conv-2",
    name: "Liam O'Connor",
    subject: "Onboarding help",
    preview: "Can you walk me through how...",
    time: "15m",
    isActive: false,
    isUnread: false,
  },
  {
    id: "conv-3",
    name: "Ava Patel",
    subject: "Sustainability report inquiry",
    preview: "Hi team, I'm looking for more...",
    time: "10:42 AM",
    isActive: true,
    isUnread: true,
  },
  {
    id: "conv-4",
    name: "Noah Davis",
    subject: "Feature request: bulk export",
    preview: "That would be extremely helpful!",
    time: "9:38 AM",
    isActive: false,
    isUnread: false,
  },
  {
    id: "conv-5",
    name: "Isabella Rossi",
    subject: "Issue with invoice #INV-4821",
    preview: "I've double-checked and it still...",
    time: "9:12 AM",
    isActive: false,
    isUnread: false,
  },
  {
    id: "conv-6",
    name: "Ethan Kim",
    subject: "Partnership opportunities",
    preview: "I'd love to explore a partnership...",
    time: "Yesterday",
    isActive: false,
    isUnread: false,
  },
];

export const messages: Message[] = [
  {
    id: "msg-1",
    side: "in",
    text: "Hi team, I'm looking for more information about your sustainability initiatives and any associated reports. Could you share the latest report?",
    time: "10:42 AM",
  },
  {
    id: "msg-2",
    side: "out",
    text: "Hi Ava! Absolutely, I'd be happy to help. Here's a link to our latest Sustainability Report 2025. Let me know if you need anything else.",
    time: "10:44 AM",
  },
  {
    id: "msg-3",
    side: "in",
    text: "Thank you! This is super helpful. Do you have any data on carbon offset results?",
    time: "10:47 AM",
  },
  {
    id: "msg-4",
    side: "out",
    text: "Yes, here's the section that covers our carbon offset programs and outcomes. We offset 12,430 tons of CO2 in 2025. Let me know if you'd like a deeper breakdown.",
    time: "10:49 AM",
  },
  {
    id: "msg-5",
    side: "in",
    text: "Perfect, that's exactly what I needed. Appreciate it!",
    time: "10:50 AM",
  },
];

export const activeContact: Contact = {
  name: "Ava Patel",
  role: "Sustainability Manager",
  company: "BrightFuture Co.",
  email: "ava.patel@brightfuture.co",
  phone: "+1 (415) 555-0189",
  website: "brightfuture.co",
  location: "San Francisco, CA, USA",
  timezone: "PDT (UTC-7)",
  status: "Qualified",
  qualifiedAt: "Feb 14, 2026",
  tags: ["Sustainability", "Enterprise", "Q2 Campaign"],
};

export const currentUser = {
  name: "Sophia Carter",
  company: "Acme Inc.",
};

export const agentName = "Noah Lee";
