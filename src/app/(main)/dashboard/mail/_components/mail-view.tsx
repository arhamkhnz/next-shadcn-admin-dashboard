"use client";

import { format } from "date-fns/format";
import {
  Archive,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Forward,
  MailOpen,
  Pin,
  Reply,
  ReplyAll,
  Tag,
  Trash2,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import type { Mail } from "./data";

interface MailDisplayProps {
  mail: Mail | null;
}

export function MailView({ mail }: MailDisplayProps) {
  return (
    <div className="flex h-full flex-col gap-3 px-2 py-3">
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Close message">
                <X />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Close message</TooltipContent>
          </Tooltip>
          <Separator className="h-4 data-vertical:self-center" orientation="vertical" />
          <div className="flex items-center gap-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Previous message">
                  <ChevronLeft />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Previous message</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Next message">
                  <ChevronRight />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Next message</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Pin thread">
                <Pin />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Pin thread</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Archive">
                <Archive />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Archive</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Reply">
                <Reply />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reply</TooltipContent>
          </Tooltip>
          <Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-sm" aria-label="More actions">
                    <EllipsisVertical />
                  </Button>
                </TooltipTrigger>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <ReplyAll />
                    Reply all
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Forward />
                    Forward
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <MailOpen />
                    Mark as unread
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Tag />
                    Add label
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent>More actions</TooltipContent>
          </Tooltip>
          <Separator className="h-4 data-vertical:self-center" orientation="vertical" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Move to trash">
                <Trash2 className="text-destructive" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move to trash</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <Separator />

      <div>
        {mail ? (
          <div className="flex flex-1 flex-col">
            <div className="flex items-start p-4">
              <div className="flex items-start gap-4 text-sm">
                <Avatar>
                  <AvatarImage alt={mail.name} />
                  <AvatarFallback>
                    {mail.name
                      .split(" ")
                      .map((chunk) => chunk[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="font-semibold">{mail.name}</div>
                  <div className="line-clamp-1 text-xs">{mail.subject}</div>
                  <div className="line-clamp-1 text-xs">
                    <span className="font-medium">Reply-To:</span> {mail.email}
                  </div>
                </div>
              </div>
              {mail.date && (
                <div className="ml-auto text-muted-foreground text-xs">{format(new Date(mail.date), "PPpp")}</div>
              )}
            </div>
            <Separator />
            <div className="flex-1 whitespace-pre-wrap p-4 text-sm">{mail.text}</div>
            <Separator className="mt-auto" />
            <div className="p-4">
              <form>
                <div className="grid gap-4">
                  <Textarea className="p-4" placeholder={`Reply ${mail.name}...`} />
                  <div className="flex items-center">
                    <Label htmlFor="mute" className="flex items-center gap-2 font-normal text-xs">
                      <Switch id="mute" aria-label="Mute thread" /> Mute this thread
                    </Label>
                    <Button onClick={(e) => e.preventDefault()} size="sm" className="ml-auto">
                      Send
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">No message selected</div>
        )}
      </div>
    </div>
  );
}
