import {Client} from 'discord.js';
import {discordToken} from './config.json';
import BlockifyModule from './Blockify.js';
import AutoModGiphyModule from './AutoModGiphy.js';

const client = new Client();

// Each module exports a function that consumes messages for the module.
// The function will return true if it consumed the message and processing
// should stop.
const modules = [BlockifyModule, AutoModGiphyModule];

client.once('ready', () => {
  console.log('Ready!');
  console.log(`Loaded ${modules.length} modules`);
});

client.on('message', (message) => {
  console.log(`[${message.channel.guild.name}#${message.channel.name}] ${message.author.username}#${message.author.discriminator} (${message.author.id}): ${message.toString()}`);
  for (const runModule of modules) {
    if (runModule(message)) {
      break;
    }
  }
});

client.login(discordToken);
