import type { Metadata } from "next";

import { Chat } from "./_components/chat";
import { conversations } from "./_components/data";

export const metadata: Metadata = {
  title: "Interface de chat open source com shadcn/ui",
  description:
    "Explore uma interface de chat open source com busca de conversas, threads de mensagens, notas internas e detalhes do contato.",
  alternates: {
    canonical: "/chat",
  },
};

export default function Page() {
  return <Chat conversations={conversations} />;
}
