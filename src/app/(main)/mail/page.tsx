import type { Metadata } from "next";

import { getValueFromCookie } from "@/server/server-actions";

import { mails } from "./_components/data";
import { MailComponent } from "./_components/mail";
import { DEFAULT_MAIL_LAYOUT, MAIL_LAYOUT_COOKIE } from "./_components/mail-layout-config";

export const metadata: Metadata = {
  title: "Open Source Email Client with shadcn/ui",
  description:
    "Explore an open source email client with inbox navigation, message search, reading, replying, and archiving.",
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
