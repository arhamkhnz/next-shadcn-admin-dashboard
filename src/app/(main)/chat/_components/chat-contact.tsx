"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getInitials } from "@/lib/utils";

import type { Contact } from "./data";

interface ChatContactProps {
  contact: Contact;
}

export function ChatContact({ contact }: ChatContactProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-6 overflow-y-auto p-6">
      <div className="flex flex-col items-center text-center">
        <Avatar className="size-16">
          <AvatarFallback className="bg-background">{getInitials(contact.name)}</AvatarFallback>
        </Avatar>
        <h2 className="mt-3 font-semibold text-lg">{contact.name}</h2>
        <p className="text-muted-foreground text-sm">{contact.role}</p>
        <p className="text-muted-foreground text-sm">{contact.company}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm">
          Email
        </Button>
        <Button variant="outline" size="sm">
          Call
        </Button>
        <Button variant="outline" size="sm">
          Profile
        </Button>
        <Button variant="outline" size="sm">
          More
        </Button>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-semibold text-sm">Contact details</h3>
        <div className="space-y-2 text-sm">
          <div>
            <div className="text-muted-foreground text-xs">Email</div>
            <div className="font-medium">{contact.email}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">Phone</div>
            <div className="font-medium">{contact.phone}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">Company</div>
            <div className="font-medium">{contact.company}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">Website</div>
            <div className="font-medium">{contact.website}</div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-semibold text-sm">About</h3>
        <div className="space-y-2 text-sm">
          <div>
            <div className="text-muted-foreground text-xs">Status</div>
            <div className="font-medium">{contact.status}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">Qualified</div>
            <div className="font-medium">{contact.qualifiedAt}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">Location</div>
            <div className="font-medium">{contact.location}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">Timezone</div>
            <div className="font-medium">{contact.timezone}</div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-semibold text-sm">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {contact.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-muted px-3 py-1 font-medium text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
