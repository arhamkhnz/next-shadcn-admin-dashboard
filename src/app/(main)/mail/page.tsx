import type { Metadata } from "next";

import { getValueFromCookie } from "@/server/server-actions";

import { mails } from "./_components/data";
import { MailComponent } from "./_components/mail";
import { DEFAULT_MAIL_LAYOUT, MAIL_LAYOUT_COOKIE } from "./_components/mail-layout-config";

export const metadata: Metadata = {
  title: "Cliente de e-mail open source com shadcn/ui",
  description:
    "Explore um cliente de e-mail open source com navegação por caixa de entrada, busca de mensagens, leitura, resposta e arquivamento.",
  alternates: {
    canonical: "/mail",
  },
};

export default async function Page() {
  const layoutCookie = await getValueFromCookie(MAIL_LAYOUT_COOKIE);

  return (
    <div className="h-dvh min-h-0 overflow-hidden">
      <MailComponent mails={mails} defaultLayout={layoutCookie ? JSON.parse(layoutCookie) : [...DEFAULT_MAIL_LAYOUT]} />
    </div>
  );
}
