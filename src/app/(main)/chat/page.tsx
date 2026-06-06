import { Chat } from "./_components/chat";
import { activeContact, conversations, messages } from "./_components/data";

export default async function Page() {
  return <Chat conversations={conversations} contact={activeContact} messages={messages} />;
}
