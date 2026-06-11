import { Chat } from "./_components/chat";
import { conversations } from "./_components/data";

export default function Page() {
  return <Chat conversations={conversations} />;
}
