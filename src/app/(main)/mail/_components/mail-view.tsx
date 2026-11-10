"use client";

import { cn } from "cn";
import { format } from "date-fns/format";
import { ptBR } from "date-fns/locale";
import {
  Archive,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Forward,
  MailOpen,
  Paperclip,
  Pin,
  Reply,
  ReplyAll,
  Send,
  Smile,
  Tag,
  Trash2,
  X,
} from "lucide-react";

import { SimpleIcon } from "@/components/simple-icon";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import type { Mail } from "./data";
import { useMail } from "./use-mail";

interface MailDisplayProps {
  mail: Mail | null;
  onClose?: () => void;
}

export function MailView({ mail, onClose }: MailDisplayProps) {
  const [, setMail] = useMail();

  function handleClose() {
    setMail({ selected: null });
    onClose?.();
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 px-2 py-3">
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Fechar mensagem" onClick={handleClose}>
                <X />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Fechar mensagem</TooltipContent>
          </Tooltip>
          <Separator className="h-4 data-vertical:self-center" orientation="vertical" />
          <div className="flex items-center gap-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Mensagem anterior">
                  <ChevronLeft />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Mensagem anterior</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Próxima mensagem">
                  <ChevronRight />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Próxima mensagem</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Fixar conversa">
                <Pin />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Fixar conversa</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Arquivar">
                <Archive />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Arquivar</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Responder">
                <Reply />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Responder</TooltipContent>
          </Tooltip>
          <Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-sm" aria-label="Mais ações">
                    <EllipsisVertical />
                  </Button>
                </TooltipTrigger>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <ReplyAll />
                    Responder a todos
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Forward />
                    Encaminhar
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <MailOpen />
                    Marcar como não lida
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Tag />
                    Adicionar marcador
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent>Mais ações</TooltipContent>
          </Tooltip>
          <Separator className="h-4 data-vertical:self-center" orientation="vertical" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Mover para a lixeira">
                <Trash2 className="text-destructive" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mover para a lixeira</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <Separator />

      <div className="flex min-h-0 flex-1 flex-col">
        {mail ? (
          <div className="flex min-h-0 flex-1 flex-col gap-3">
            <div className="space-y-1.5">
              <div className="font-medium leading-none">{mail.subject}</div>

              <div className="text-muted-foreground text-xs leading-none">
                {format(new Date(mail.receivedAt), "EEE, d 'de' MMM 'de' yyyy, HH:mm", { locale: ptBR })}
              </div>
            </div>

            <Separator />

            <div className="flex gap-2">
              <Avatar className="size-9 after:rounded-sm">
                <AvatarFallback className="rounded-sm bg-background">{mail.from.name[0]}</AvatarFallback>
              </Avatar>

              <div className="flex h-full flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="text-xs">{mail.from.name}</div>
                  <Separator className="h-3 data-vertical:self-center" orientation="vertical" />
                  <div className="text-muted-foreground text-xs">{mail.from.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-muted-foreground text-xs">
                    Para:{" "}
                    <span className="text-foreground">{mail.to.map((recipient) => recipient.name).join(", ")}</span>
                  </div>

                  {mail.cc?.length ? (
                    <div className="text-muted-foreground text-xs">
                      Cc:{" "}
                      <span className="text-foreground">{mail.cc.map((recipient) => recipient.name).join(", ")}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <Separator />

            {mail.attachments?.length ? (
              <>
                <Collapsible defaultOpen>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "group p-0 font-normal text-muted-foreground",
                        "hover:bg-transparent hover:text-muted-foreground dark:hover:bg-transparent",
                        "data-[state=open]:bg-transparent data-[state=open]:text-muted-foreground",
                      )}
                    >
                      Anexos ({mail.attachments.length})
                      <ChevronDown className="group-data-[state=open]:rotate-180" />
                    </Button>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="flex flex-wrap gap-2">
                      {mail.attachments.map((attachment) => (
                        <Button size="xs" variant="secondary" key={attachment.id}>
                          <SimpleIcon icon={attachment.icon} className="size-3 fill-current" />
                          <span className="font-normal">{attachment.name}</span>
                          <span className="font-normal text-muted-foreground">{attachment.size}</span>
                        </Button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Separator className="my-2" />
              </>
            ) : null}

            <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto whitespace-pre-wrap text-sm">{mail.body}</div>

            <div className="mt-auto flex flex-col gap-3">
              <Separator />
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <Reply />
                </InputGroupAddon>
                <InputGroupInput className="text-xs" placeholder={`Responder ${mail.from.name}...`} />
                <InputGroupAddon className="gap-1" align="inline-end">
                  <InputGroupButton variant="ghost">
                    <Smile />
                  </InputGroupButton>
                  <InputGroupButton variant="ghost">
                    <Paperclip />
                  </InputGroupButton>
                  <InputGroupButton variant="ghost">
                    <Send />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>
        ) : (
          <div className="grid h-full place-items-center text-muted-foreground text-sm">Nenhum e-mail selecionado</div>
        )}
      </div>
    </div>
  );
}
