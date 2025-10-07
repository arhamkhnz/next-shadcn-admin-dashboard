"use client";

import * as React from "react";
import { Bell, Check, ChevronRight, MoreHorizontal, Star, User, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, getInitials } from "@/lib/utils";

// Event types for notifications
export type EventType = "purchase" | "signup" | "login" | "review" | "support" | "alert";

// Notification interface
export interface Notification {
  id: string;
  type: EventType;
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  isPriority: boolean;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  metadata?: Record<string, unknown>;
}

// Icon mapping for notification types
export const notificationIcons: Record<EventType, React.ReactNode> = {
  purchase: (
    <div className="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full">
      <Star className="size-3" />
    </div>
  ),
  signup: (
    <div className="bg-chart-2/10 text-chart-2 flex size-6 items-center justify-center rounded-full">
      <User className="size-3" />
    </div>
  ),
  login: (
    <div className="bg-chart-3/10 text-chart-3 flex size-6 items-center justify-center rounded-full">
      <User className="size-3" />
    </div>
  ),
  review: (
    <div className="bg-chart-4/10 text-chart-4 flex size-6 items-center justify-center rounded-full">
      <Star className="size-3" />
    </div>
  ),
  support: (
    <div className="bg-chart-5/10 text-chart-5 flex size-6 items-center justify-center rounded-full">
      <Bell className="size-3" />
    </div>
  ),
  alert: (
    <div className="bg-destructive/10 text-destructive flex size-6 items-center justify-center rounded-full">
      <Bell className="size-3" />
    </div>
  ),
};

// Notification item component
export function NotificationItem({
  notification,
  formatRelativeTime,
  markAsRead,
  togglePriority,
}: {
  notification: Notification;
  formatRelativeTime: (timestamp: Date) => string;
  markAsRead: (id: string) => void;
  togglePriority: (id: string) => void;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-lg border p-2 transition-colors",
        !notification.isRead && "bg-muted/40",
        notification.isPriority && "border-primary/50",
      )}
    >
      <div className="mt-0.5">{notificationIcons[notification.type]}</div>

      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5">
            <h4 className="text-xs leading-none font-medium">{notification.title}</h4>
            <p className="text-muted-foreground text-xs">{notification.description}</p>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-muted-foreground text-[10px]">{formatRelativeTime(notification.timestamp)}</span>
            {!notification.isRead && <Badge variant="default" className="h-1 w-1 rounded-full p-0" />}
          </div>
        </div>

        {notification.user && (
          <div className="flex items-center gap-1.5 pt-0.5">
            <Avatar className="size-4">
              <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
              <AvatarFallback className="text-[8px]">{getInitials(notification.user.name)}</AvatarFallback>
            </Avatar>
            <span className="text-[10px]">{notification.user.name}</span>
          </div>
        )}

        {notification.metadata && (
          <div className="bg-muted/50 mt-1 rounded-md px-1.5 py-1">
            <div className="grid grid-cols-1 gap-0.5 @md/feed:grid-cols-2">
              {Object.entries(notification.metadata).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[10px]"
            onClick={() => {
              /* View details action */
            }}
          >
            View Details
            <ChevronRight className="ml-0.5 size-2.5" />
          </Button>

          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="size-5"
              onClick={() => togglePriority(notification.id)}
              title={notification.isPriority ? "Remove priority" : "Mark as priority"}
            >
              <Star
                className={cn(
                  "size-3",
                  notification.isPriority ? "fill-primary text-primary" : "text-muted-foreground",
                )}
              />
            </Button>

            {!notification.isRead ? (
              <Button
                variant="ghost"
                size="icon"
                className="size-5"
                onClick={() => markAsRead(notification.id)}
                title="Mark as read"
              >
                <Check className="text-muted-foreground size-3" />
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-5">
                    <MoreHorizontal className="text-muted-foreground size-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                  <DropdownMenuItem>Snooze notification</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <X className="mr-1.5 size-3" />
                    Dismiss
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Notification list component
export function NotificationList({
  notifications,
  formatRelativeTime,
  markAsRead,
  togglePriority,
}: {
  notifications: Notification[];
  formatRelativeTime: (timestamp: Date) => string;
  markAsRead: (id: string) => void;
  togglePriority: (id: string) => void;
}) {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1.5">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          formatRelativeTime={formatRelativeTime}
          markAsRead={markAsRead}
          togglePriority={togglePriority}
        />
      ))}
    </div>
  );
}
