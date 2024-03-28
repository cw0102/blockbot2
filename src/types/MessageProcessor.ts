import type { Message } from "discord.js";
import type { ModuleConfig } from "./Config";

export type MessageProcessor = (message: Message, config: ModuleConfig) => boolean;