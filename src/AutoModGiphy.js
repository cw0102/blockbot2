import {adminIds} from './config.json';
import {Message} from 'discord.js';

const enabled = new Map();
const defaultExpireTime = 300000;
const moduleCommandPrefix = '!automod giphy ';

const commandPrefixChangeTime = 'time ';

/**
 * Automatically schedules giphy and tenor links for deletion
 * after a given time period.
 * @param {Message} message The message to process
 * @return {boolean}  If this module consumed the message
 */
export default function processMessage(message) {
  if (adminIds.includes(message.author.id) && message.content.startsWith(moduleCommandPrefix)) {
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
      if (newTime != NaN) {
        enabled.set(message.channel.id, newTime);
      }
      message.channel.send('Giphy AutoMod timer updated.');
      return true;
    }
  }


  return false;
}
