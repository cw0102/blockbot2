import type {Message} from 'discord.js';
import type {
  MessageProcessor,
  MessageProcessorPayload,
} from '../types/MessageProcessor';

const enabled = new Map();
const defaultExpireTime = 300000;
const moduleCommandPrefix = '!automod giphy ';

const commandPrefixChangeTime = 'time ';

/**
 * Automatically schedules giphy, tenor, and gfycat links for deletion
 * after a given time period.
 * @param {MessageProcessorPayload} payload The message processor payload
 * @return {boolean} If this module consumed the message
 */
const processMessage: MessageProcessor = (
  payload: MessageProcessorPayload,
): boolean => {
  const {config, message} = payload;
  if (
    config.adminIds.includes(message.author.id) &&
    message.content.startsWith(moduleCommandPrefix)
  ) {
    const command = message.content.substring(moduleCommandPrefix.length);
    if (command === 'on') {
      enabled.set(message.channel.id, defaultExpireTime);
      message.reply('Giphy AutoMod enabled.').catch(err => console.error(err));
      return true;
    } else if (command === 'off') {
      enabled.delete(message.channel.id);
      message.reply('Giphy AutoMod disabled.').catch(err => console.error(err));
      return true;
    } else if (command.startsWith(commandPrefixChangeTime)) {
      const newTime = parseInt(
        command.substring(commandPrefixChangeTime.length),
      );
      if (!Number.isNaN(newTime)) {
        enabled.set(message.channel.id, newTime);
      }
      message
        .reply('Giphy AutoMod timer updated.')
        .catch(err => console.error(err));
      return true;
    }
  }

  if (enabled.has(message.channel.id) && !message.author.bot) {
    if (containsGiphyLink(message)) {
      removeMessageEventually(message, enabled.get(message.channel.id));
    }
  }

  return false;
};

export default processMessage;

/**
 * Determines if the message contains a giphy link
 * @param {Message} message The message to parse
 * @return {boolean} Whether the message contains a giphy or tenor link
 */
function containsGiphyLink(message: Message): boolean {
  const pattern =
    /https?:\/\/(\w+\.)?(tenor|giphy|gfycat)\.com\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/;
  if (message.content.search(pattern) !== -1) {
    return true;
  }

  return false;
}

/**
 * Post a notification and remove the link after the set time period
 * @param {Message} message The message to remove
 * @param {number} timeout The number of milliseconds to wait
 */
function removeMessageEventually(message: Message, timeout: number) {
  const notification = message.reply(
    'Giphy and Tenor links will be removed after a set time period.',
  );
  setTimeout(() => {
    message
      .delete()
      .then(() => {
        notification
          .then(msg => {
            msg
              .edit(
                'A giphy/tenor link was here, but it was removed by AutoMod.',
              )
              .catch(err => console.error(err));
          })
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  }, timeout);
}
