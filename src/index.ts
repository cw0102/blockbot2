import type {Message, OmitPartialGroupDMChannel} from 'discord.js';
import {Client, Events, GatewayIntentBits, TextChannel} from 'discord.js';

import * as Plugins from './plugins';
import type {MessageProcessor} from './types/MessageProcessor';
import {loadConfig} from './config';

const {discordToken, ...config} = loadConfig();

// Each module exports a `processMessage` function that consumes messages for the module.
// The function will return true if it consumed the message and processing
// should stop.
const modules: MessageProcessor[] = [
  Plugins.Blockify,
  Plugins.AutoModGiphy,
  Plugins.Whendwalker,
  Plugins.PrimalStormTracker,
];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client
  .once(Events.ClientReady, () => {
    console.log('Ready!');
    console.log(`Loaded ${modules.length} modules`);
  })

  .on(
    Events.MessageCreate,
    (message: OmitPartialGroupDMChannel<Message<boolean>>) => {
      for (const runModule of modules) {
        if (runModule({message, config})) {
          const channelTag = !(message.channel instanceof TextChannel)
            ? `${message.channel.id}`
            : `${message.channel.guild.name}#${message.channel.name}`;
          console.log(
            `[${channelTag}] ${message.author.username}#${message.author.discriminator} (${message.author.id}): ${message.content}`,
          );
          break;
        }
      }
    },
  );

client.login(discordToken).catch(err => {
  console.log(`Login error: ${err}`);
});
