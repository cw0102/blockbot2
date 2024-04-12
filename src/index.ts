import {
  Client,
  Events,
  GatewayIntentBits,
  Message,
  TextChannel,
} from "discord.js";

import BlockifyModule from "./plugins/Blockify";
import AutoModGiphyModule from "./plugins/AutoModGiphy";
import Whendwalker from "./plugins/Whendwalker";
import type { MessageProcessor } from "./types/MessageProcessor";
import { loadConfig } from "./config";
import PrimalStormTracker from "./plugins/PrimalStormTracker";

const { discordToken, ...config } = loadConfig();

// Each module exports a `processMessage` function that consumes messages for the module.
// The function will return true if it consumed the message and processing
// should stop.
const modules: MessageProcessor[] = [
  BlockifyModule,
  AutoModGiphyModule,
  Whendwalker,
  PrimalStormTracker,
];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client
  .once("ready", () => {
    console.log("Ready!");
    console.log(`Loaded ${modules.length} modules`);
  })

  .on(Events.MessageCreate, (message: Message<true>) => {
    for (const runModule of modules) {
      if (runModule({ message, config })) {
        const channelTag = !(message.channel instanceof TextChannel)
          ? `${message.channel.id}`
          : `${message.channel.guild.name}#${message.channel.name}`;
        console.log(
          `[${channelTag}] ${message.author.username}#${message.author.discriminator} (${message.author.id}): ${message.content}`
        );
        break;
      }
    }
  });

client.login(discordToken).catch((err) => {
  console.log(`Login error: ${err}`);
});
