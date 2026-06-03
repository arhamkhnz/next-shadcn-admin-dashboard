import { create } from "zustand";

import type { ChatHistoryItem } from "./data";
import { chatHistory } from "./data";

type Config = {
  selected: ChatHistoryItem["id"] | null;
};

type ChatStore = {
  chat: Config;
  setChat: (chat: Config) => void;
};

const useChatStore = create<ChatStore>((set) => ({
  chat: {
    selected: chatHistory[0].id,
  },
  setChat: (chat) => set({ chat }),
}));

export function useChat() {
  const chat = useChatStore((state) => state.chat);
  const setChat = useChatStore((state) => state.setChat);

  return [chat, setChat] as const;
}
