import type { Message } from "discord.js";
import type { Config } from "./Config";
import type { BBStorage } from "./Storage";

export type MessageProcessor = (data: MessageProcessorPayload) => boolean;

export interface MessageProcessorPayload {
  message: Message;
  config: Config;
  storage?: BBStorage;
}
