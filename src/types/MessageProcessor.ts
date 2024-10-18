import type {Message, OmitPartialGroupDMChannel} from 'discord.js';
import type {Config} from './Config';
import type {BBStorage} from './Storage';

export type MessageProcessor = (data: MessageProcessorPayload) => boolean;

export interface MessageProcessorPayload {
  message: OmitPartialGroupDMChannel<Message<boolean>>;
  config: Config;
  storage?: BBStorage;
}
