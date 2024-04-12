import type { Message } from "discord.js";
import type { Config } from "./Config";

export type MessageProcessor = (data: MessageProcessorPayload) => boolean;

export interface MessageProcessorPayload {
  message: Message<true>;
  config: Config;
}
