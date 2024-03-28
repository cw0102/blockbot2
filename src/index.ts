import { Client, Message, TextChannel } from 'discord.js';

import BlockifyModule from './plugins/Blockify';
import AutoModGiphyModule from './plugins/AutoModGiphy';
import Whendwalker from './plugins/Whendwalker';
import type { MessageProcessor } from './types/MessageProcessor';
import { loadConfig } from './config';

const {discordToken, ...config} = loadConfig();

// Each module exports a `processMessage` function that consumes messages for the module.
// The function will return true if it consumed the message and processing
// should stop.
const modules: MessageProcessor[] = [BlockifyModule, AutoModGiphyModule, Whendwalker];

const client = new Client();

client.once('ready', () => {
  console.log('Ready!');
  console.log(`Loaded ${modules.length} modules`);
});

client.on('message', (message: Message) => {
  for (const runModule of modules) {
    if (runModule(message, config)) {
      const channelTag = !(message.channel instanceof TextChannel) ? `${message.channel.id}` : `${message.channel.guild.name}#${message.channel.name}`;
      console.log(`[${channelTag}] ${message.author.username}#${message.author.discriminator} (${message.author.id}): ${message.toString()}`);
      break;
    }
  }
});

client.login(discordToken).catch((err) => {
  console.log(`Login error: ${err}`);
});
