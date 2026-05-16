import { getValueFromCookie } from "@/server/server-actions";

import { accounts, mails } from "./_components/data";
import { MailComponent } from "./_components/mail";
import {
  DEFAULT_MAIL_COLLAPSED,
  DEFAULT_MAIL_LAYOUT,
  MAIL_COLLAPSED_COOKIE,
  MAIL_LAYOUT_COOKIE,
} from "./_components/mail-layout-config";

export default async function Page() {
  const [layoutCookie, collapsedCookie] = await Promise.all([
    getValueFromCookie(MAIL_LAYOUT_COOKIE),
    getValueFromCookie(MAIL_COLLAPSED_COOKIE),
  ]);

  return (
    <div
      data-content-padding="false"
      className="h-[calc(100svh-var(--dashboard-header-height))] min-h-0 overflow-hidden"
    >
      <MailComponent
        accounts={accounts}
        mails={mails}
        defaultLayout={layoutCookie ? JSON.parse(layoutCookie) : [...DEFAULT_MAIL_LAYOUT]}
        defaultCollapsed={collapsedCookie ? JSON.parse(collapsedCookie) : DEFAULT_MAIL_COLLAPSED}
      />
    </div>
  );
}
