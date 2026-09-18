import type { Metadata } from "next";

import { Chat } from "./_components/chat";
import { conversations } from "./_components/data";

export const metadata: Metadata = {
  title: "Open Source Chat Interface with shadcn/ui",
  description:
    "Explore an open source chat interface with conversation search, message threads, internal notes, and contact details.",
};

export default function Page() {
  return <Chat conversations={conversations} />;
}
