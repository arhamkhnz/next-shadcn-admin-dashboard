"use client";

import { cn } from "cn";
import {
  AlarmClock,
  ArrowLeft,
  Copy,
  Flag,
  Link,
  MoreHorizontal,
  Paperclip,
  PhoneCall,
  Send,
  Smile,
  Sparkles,
  Tag,
  Type,
  UserRound,
} from "lucide-react";

import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group";
import { Marker, MarkerContent } from "@/components/ui/marker";
import { Message, MessageAvatar, MessageContent, MessageFooter } from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getInitials } from "@/lib/utils";

import { type Message as ChatMessage, type Contact, currentUser } from "./data";

interface ChatThreadProps {
  contact: Contact;
  messages: ChatMessage[];
  onOpenContact?: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  className?: string;
}

export function ChatThread({ contact, messages, onOpenContact, onBack, showBackButton, className }: ChatThreadProps) {
  return (
    <div className={cn("flex h-full flex-col py-3", className)}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4 px-2">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Button
                variant="ghost"
                size="icon-sm"
                className="md:hidden"
                aria-label="Voltar às conversas"
                onClick={onBack}
              >
                <ArrowLeft />
              </Button>
            )}
            <Avatar className="size-8">
              <AvatarFallback className="bg-background text-foreground">{getInitials(contact.name)}</AvatarFallback>
              <AvatarBadge className="bg-green-600 dark:bg-green-800" />
            </Avatar>
            <div>
              <div className="text-sm font-medium">{contact.name}</div>
              <div className="text-muted-foreground text-xs leading-3">{contact.role}</div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Ligar">
                  <PhoneCall />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Ligar</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Marcador">
                  <Tag />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Marcador</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Adiar">
                  <AlarmClock />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Adiar</TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Mais ações">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuGroup>
                  <DropdownMenuItem onSelect={onOpenContact}>
                    <UserRound />
                    Ver perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy />
                    Copiar e-mail
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Flag />
                    Marcar como prioridade
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive">Bloquear contato</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Separator />
      </div>

      <MessageScrollerProvider autoScroll>
        <MessageScroller className="min-h-0 flex-1">
          <MessageScrollerViewport>
            <MessageScrollerContent className="gap-6 px-2 py-8">
              <Marker variant="separator">
                <MarkerContent>6 de maio de 2026</MarkerContent>
              </Marker>

              {messages.map((message) => {
                const isOutbound = message.align === "end";
                const reactionAlign = isOutbound ? "start" : "end";
                const senderName = isOutbound ? currentUser.name : contact.name;

                return (
                  <MessageScrollerItem
                    key={message.id}
                    messageId={String(message.id)}
                    scrollAnchor={message.align === "end"}
                  >
                    <Message align={message.align}>
                      <MessageAvatar>
                        <Avatar>
                          <AvatarFallback
                            className={cn(
                              "bg-muted text-foreground text-xs",
                              isOutbound && "bg-primary text-primary-foreground",
                            )}
                          >
                            {getInitials(senderName)}
                          </AvatarFallback>
                        </Avatar>
                      </MessageAvatar>

                      <MessageContent>
                        <BubbleGroup>
                          <Bubble variant={isOutbound ? "default" : "muted"} align={message.align}>
                            <BubbleContent>{message.text}</BubbleContent>
                            {message.reaction ? (
                              <BubbleReactions aria-label={`Reação: ${message.reaction}`} align={reactionAlign}>
                                <span>{message.reaction}</span>
                              </BubbleReactions>
                            ) : null}
                          </Bubble>
                        </BubbleGroup>
                        <MessageFooter>{message.time}</MessageFooter>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                );
              })}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>

      <div className="px-2">
        <Tabs defaultValue="reply" className="gap-0 rounded-md border">
          <TabsList
            variant="line"
            className="w-full justify-start gap-2 border-b px-3 group-data-horizontal/tabs:h-10 **:data-[slot=tabs-trigger]:border-x-0 **:data-[slot=tabs-trigger]:px-6"
          >
            <TabsTrigger value="reply" className="flex-none px-1">
              Responder
            </TabsTrigger>
            <TabsTrigger value="note" className="flex-none px-1">
              Nota interna
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reply" className="m-0">
            <MessageComposer placeholder="Digite sua mensagem..." />
          </TabsContent>
          <TabsContent value="note" className="m-0">
            <MessageComposer placeholder="Escreva uma nota interna..." />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function MessageComposer({ placeholder }: { placeholder: string }) {
  return (
    <form
      className="w-full"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <InputGroup className="border-0 bg-transparent shadow-none has-[[data-slot=input-group-control]:focus-visible]:border-0 has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot][aria-invalid=true]]:border-0 has-[[data-slot][aria-invalid=true]]:ring-0 dark:bg-transparent dark:has-[[data-slot][aria-invalid=true]]:ring-0">
        <InputGroupTextarea
          placeholder={placeholder}
          className="min-h-14 px-3 py-2.5 text-sm ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:aria-invalid:ring-0"
        />
        <InputGroupAddon align="block-end">
          <InputGroupButton aria-label="Formatar" type="button" size="icon-sm">
            <Type />
          </InputGroupButton>
          <InputGroupButton aria-label="Emoji" type="button" size="icon-sm">
            <Smile />
          </InputGroupButton>
          <InputGroupButton aria-label="Anexar arquivo" type="button" size="icon-sm">
            <Paperclip />
          </InputGroupButton>
          <InputGroupButton aria-label="Inserir link" type="button" size="icon-sm">
            <Link />
          </InputGroupButton>
          <InputGroupButton aria-label="Assistente de IA" type="button" size="icon-sm" variant="outline">
            <Sparkles />
          </InputGroupButton>
          <InputGroupButton type="submit" variant="default" size="icon-sm" className="ml-auto">
            <Send />
            <span className="sr-only">Enviar</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
