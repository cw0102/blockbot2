import { Message } from 'discord.js';
import { MessageProcessor } from '../types/MessageProcessor';
import { ModuleConfig } from '../types/Config';

const enabled = new Map();
const defaultExpireTime = 300000;
const moduleCommandPrefix = '!automod giphy ';

const commandPrefixChangeTime = 'time ';

/**
 * Automatically schedules giphy, tenor, and gfycat links for deletion
 * after a given time period.
 * @param {Message} message The message to process
 * @param {ModuleConfig} config The bot configuration
 * @return {boolean}  If this module consumed the message
 */
const processMessage: MessageProcessor = (message: Message, config: ModuleConfig): boolean => {
    if (config.adminIds.includes(message.author.id) && message.content.startsWith(moduleCommandPrefix)) {
      const command = message.content.substring(moduleCommandPrefix.length);
      if (command == 'on') {
        enabled.set(message.channel.id, defaultExpireTime);
        message.channel.send('Giphy AutoMod enabled.');
        return true;
      } else if (command == 'off') {
        enabled.delete(message.channel.id);
        message.channel.send('Giphy AutoMod disabled.');
        return true;
      } else if (command.startsWith(commandPrefixChangeTime)) {
        const newTime = parseInt(command.substring(commandPrefixChangeTime.length));
        if (!Number.isNaN(newTime)) {
          enabled.set(message.channel.id, newTime);
        }
        message.channel.send('Giphy AutoMod timer updated.');
        return true;
      }
    }

    if (enabled.has(message.channel.id) && !message.author.bot) {
      if (containsGiphyLink(message)) {
        removeMessageEventually(message, enabled.get(message.channel.id));
      }
    }


    return false;
  }


export default processMessage;

/**
 * Determines if the message contains a giphy link
 * @param {Message} message The message to parse
 * @return {boolean} Whether the message contains a giphy or tenor link
 */
function containsGiphyLink(message: Message): boolean {
  const pattern = /https?:\/\/(\w+\.)?(tenor|giphy|gfycat)\.com\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/;
  if (message.content.search(pattern) != -1) {
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
  const notification = message.reply('Giphy and Tenor links will be removed after a set time period.');
  setTimeout(() => {
    message.delete().then(() => {
      notification.then((msg) => {
        msg.edit('A giphy/tenor link was here, but it was removed by AutoMod.');
      });
    });
  }, timeout);
}
