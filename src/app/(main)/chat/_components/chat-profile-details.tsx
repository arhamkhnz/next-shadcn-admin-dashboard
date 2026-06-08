"use client";

import {
  Building2,
  Calendar,
  CheckCircle2,
  Globe,
  Link,
  Mail,
  MapPin,
  Monitor,
  MoreHorizontal,
  Phone,
  PhoneCall,
  Tag,
  UserRound,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getInitials } from "@/lib/utils";

import type { Contact } from "./data";

interface ChatProfileDetailsProps {
  contact: Contact;
  onClose?: () => void;
}

export function ChatProfileDetails({ contact, onClose }: ChatProfileDetailsProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto p-4">
      <div className="flex items-start gap-3">
        <Avatar size="lg" className="shrink-0">
          <AvatarFallback className="bg-background">{getInitials(contact.name)}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="truncate font-medium leading-5">{contact.name}</div>
          <div className="truncate text-muted-foreground text-xs">{contact.role}</div>
        </div>

        <Button variant="ghost" size="icon-sm" aria-label="Close profile" onClick={onClose}>
          <X />
        </Button>
      </div>

      <div className="flex gap-2">
        <Button size="icon-sm" variant="ghost" aria-label="Email">
          <Mail className="size-3.5" />
        </Button>
        <Button size="icon-sm" variant="ghost" aria-label="Call">
          <PhoneCall className="size-3.5" />
        </Button>
        <Button size="icon-sm" variant="ghost" aria-label="Schedule">
          <Calendar className="size-3.5" />
        </Button>
        <Button size="icon-sm" variant="ghost" aria-label="Copy link">
          <Link className="size-3.5" />
        </Button>
        <Button size="icon-sm" variant="ghost" aria-label="More">
          <MoreHorizontal className="size-3.5" />
        </Button>
      </div>

      <Tabs defaultValue="details">
        <TabsList variant="line" className="w-full justify-between border-b px-0 **:data-[slot=tabs-trigger]:flex-1">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">Email</span>
            <span className="ml-auto truncate text-sm">{contact.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">Phone</span>
            <span className="ml-auto truncate text-sm">{contact.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">Website</span>
            <span className="ml-auto truncate text-sm">{contact.website}</span>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Building2 className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">Company</span>
            <span className="ml-auto truncate text-sm">{contact.company}</span>
          </div>
          <div className="flex items-center gap-2">
            <UserRound className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">Role</span>
            <span className="ml-auto truncate text-sm">{contact.role}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">Stage</span>
            <Badge variant="secondary" className="ml-auto">
              {contact.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">Qualified since</span>
            <span className="ml-auto truncate text-sm">{contact.qualifiedAt}</span>
          </div>
          <div className="flex items-center gap-2">
            <Monitor className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">Timezone</span>
            <span className="ml-auto truncate text-sm">{contact.timezone}</span>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">Location</span>
            <span className="ml-auto truncate text-sm">{contact.location}</span>
          </div>
          <div className="flex items-start gap-2">
            <Tag className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">Tags</span>
            <div className="ml-auto flex flex-wrap justify-end gap-1">
              {contact.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
