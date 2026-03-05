import type { CommChannel } from "../connection";
import type { SliceCreator } from "./types";

export interface ChatMessage {
  id: number;
  type: "channel" | "text";
  channel?: string;
  sender?: string;
  text: string;
  timestamp: number;
}

export interface ChatSlice {
  messages: ChatMessage[];
  addChannelMessage: (data: CommChannel) => void;
  addTextLine: (text: string) => void;
}

const MAX_MESSAGES = 500;
let nextMessageId = 1;

export const createChatSlice: SliceCreator<ChatSlice> = (set) => ({
  messages: [],
  addChannelMessage: (data) =>
    set((state) => {
      const msg: ChatMessage = {
        id: nextMessageId++,
        type: "channel",
        channel: data.channel,
        sender: data.sender,
        text: data.message,
        timestamp: Date.now(),
      };
      const messages = [...state.messages, msg];
      return { messages: messages.length > MAX_MESSAGES ? messages.slice(-MAX_MESSAGES) : messages };
    }),
  addTextLine: (text) =>
    set((state) => {
      const msg: ChatMessage = {
        id: nextMessageId++,
        type: "text",
        text,
        timestamp: Date.now(),
      };
      const messages = [...state.messages, msg];
      return { messages: messages.length > MAX_MESSAGES ? messages.slice(-MAX_MESSAGES) : messages };
    }),
});
