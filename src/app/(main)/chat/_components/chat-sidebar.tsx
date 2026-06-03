"use client";

import { ChevronRight, EllipsisVertical, FileText, Plus, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { chatHistory, savedPrompts } from "./data";
import { useChat } from "./use-chat";

export function ChatSidebar() {
  const [chat, setChat] = useChat();

  return (
    <Sidebar className="**:data-[sidebar=sidebar]:bg-background">
      <SidebarHeader>
        <SidebarMenuButton>
          <Sparkles />
          <span className="font-medium text-base">Studio AI</span>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="sm">
                <Plus />
                New Chat
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Chat History</SidebarGroupLabel>
          <SidebarGroupAction className="[&>svg]:size-3">
            <EllipsisVertical /> <span className="sr-only">Add Project</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {chatHistory.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    className="flex h-auto flex-col items-stretch gap-1 data-[active=true]:font-normal"
                    isActive={chat?.selected === item.id}
                    onClick={() => setChat({ selected: item.id })}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm group-data-[active=true]/menu-button:font-medium">{item.title}</p>
                      <span className="shrink-0 text-muted-foreground text-xs">{item.time}</span>
                    </div>
                    <p className="truncate text-muted-foreground text-sm">{item.description}</p>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Saved Prompts</SidebarGroupLabel>
          <SidebarGroupAction className="[&>svg]:size-3">
            <Plus /> <span className="sr-only">Add Project</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {savedPrompts.map((prompt) => (
                <SidebarMenuItem key={prompt}>
                  <SidebarMenuButton>
                    <FileText />
                    <span className="truncate">{prompt}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <SidebarMenuItem>
                <SidebarMenuButton className="text-muted-foreground">
                  <span>View all saved prompts</span>
                  <ChevronRight className="ml-auto" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-sm">8k of 20K messages used</p>
            <Progress value={40} />
          </div>

          <Button variant="outline" size="sm" className="w-full">
            Manage Plan
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
