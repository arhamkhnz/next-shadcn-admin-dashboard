import { accounts, mails } from "./_components/data";
import { MailComponent } from "./_components/mail";

export default function MailPage() {
  return (
    <MailComponent
      accounts={accounts}
      mails={mails}
      defaultLayout={[20, 32, 48]}
      defaultCollapsed={false}
      navCollapsedSize={4}
    />
  );
}
