"use client";

import * as React from "react";

import { Bell, Filter, RefreshCw, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { mockNotifications } from "./data/notifications-data";
import { Notification, NotificationList } from "./notification-components";

// Extract to a separate file to reduce line count
function EmptyNotificationsState({ searchQuery, activeTab }: { searchQuery: string; activeTab: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <Bell className="text-muted-foreground/50 size-8" />
      <h3 className="mt-2 text-sm font-medium">No notifications</h3>
      <p className="text-muted-foreground mt-1 text-xs">
        {searchQuery
          ? "No notifications match your search criteria"
          : activeTab === "unread"
            ? "You're all caught up!"
            : activeTab === "priority"
              ? "No priority notifications"
              : "You don't have any notifications yet"}
      </p>
    </div>
  );
}

export function RealtimeNotificationsFeed() {
  const [notifications, setNotifications] = React.useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Filter notifications based on active tab and search query
  const filteredNotifications = React.useMemo(() => {
    let filtered = [...notifications];

    // Filter by tab
    if (activeTab === "unread") {
      filtered = filtered.filter((notification) => !notification.isRead);
    } else if (activeTab === "priority") {
      filtered = filtered.filter((notification) => notification.isPriority);
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (notification) =>
          notification.title.toLowerCase().includes(query) ||
          notification.description.toLowerCase().includes(query) ||
          notification.user?.name.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [notifications, activeTab, searchQuery]);

  // Handle marking a notification as read
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    );
  };

  // Handle marking all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
  };

  // Handle toggling priority status
  const togglePriority = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, isPriority: !notification.isPriority } : notification,
      ),
    );
  };

  // Handle refreshing the feed
  const refreshFeed = () => {
    setIsRefreshing(true);

    // Simulate API call delay
    setTimeout(() => {
      // In a real app, you would fetch new data here
      setIsRefreshing(false);
    }, 1000);
  };

  // Format timestamp relative to now
  const formatRelativeTime = (timestamp: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
  };

  // Calculate notification statistics
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const priorityCount = notifications.filter((n) => n.isPriority).length;

  return (
    <Card className="@container/feed flex h-full flex-col">
      <CardHeader className="flex-shrink-0 pb-2">
        <CardTitle className="flex items-center gap-1.5 text-sm">
          <Bell className="size-4" />
          Realtime Notifications
        </CardTitle>
        <CardDescription className="text-xs">User activity and system alerts</CardDescription>
        <CardAction className="flex gap-1.5">
          <Button variant="outline" size="sm" onClick={refreshFeed} disabled={isRefreshing} className="h-7 text-xs">
            <RefreshCw className={cn("mr-1.5 size-3.5", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <Filter className="mr-1.5 size-3.5" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>All Types</DropdownMenuItem>
              <DropdownMenuItem>Purchases</DropdownMenuItem>
              <DropdownMenuItem>User Activity</DropdownMenuItem>
              <DropdownMenuItem>System Alerts</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Last 24 Hours</DropdownMenuItem>
              <DropdownMenuItem>Last 7 Days</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-2 overflow-hidden pt-0">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1.5 left-1.5 size-3.5" />
              <Input
                placeholder="Search notifications..."
                className="h-7 pl-7 text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="h-7 text-xs"
            >
              Mark all read
            </Button>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col">
            <TabsList className="grid h-8 w-full flex-shrink-0 grid-cols-3">
              <TabsTrigger value="all" className="py-1 text-xs">
                All
                <Badge variant="outline" className="ml-1.5 px-1 py-0 text-[10px]">
                  {notifications.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="unread" className="py-1 text-xs">
                Unread
                <Badge variant="outline" className="ml-1.5 px-1 py-0 text-[10px]">
                  {unreadCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="priority" className="py-1 text-xs">
                Priority
                <Badge variant="outline" className="ml-1.5 px-1 py-0 text-[10px]">
                  {priorityCount}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-2 flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto">
                <NotificationList
                  notifications={filteredNotifications}
                  formatRelativeTime={formatRelativeTime}
                  markAsRead={markAsRead}
                  togglePriority={togglePriority}
                />
              </div>
            </TabsContent>

            <TabsContent value="unread" className="mt-2 flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto">
                <NotificationList
                  notifications={filteredNotifications}
                  formatRelativeTime={formatRelativeTime}
                  markAsRead={markAsRead}
                  togglePriority={togglePriority}
                />
              </div>
            </TabsContent>

            <TabsContent value="priority" className="mt-2 flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto">
                <NotificationList
                  notifications={filteredNotifications}
                  formatRelativeTime={formatRelativeTime}
                  markAsRead={markAsRead}
                  togglePriority={togglePriority}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {filteredNotifications.length === 0 && (
          <EmptyNotificationsState searchQuery={searchQuery} activeTab={activeTab} />
        )}
      </CardContent>
    </Card>
  );
}
