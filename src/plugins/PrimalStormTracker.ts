import { DMChannel, GroupDMChannel, TextChannel } from "discord.js";
import {
  MessageProcessor,
  MessageProcessorPayload,
} from "../types/MessageProcessor";
import schedule from "node-schedule";

const kNotifyPrimalStormOn = "!primalstorm on";
const kNotifyPrimalStormOff = "!primalstorm off";

const enabled = new Map<string, TextChannel | DMChannel | GroupDMChannel>();

/**
 * Post messages when Primal Storms rotate
 * @param {MessageProcessorPayload} payload The message processor payload
 * @return {boolean} If this module consumed the message
 */
const processMessage: MessageProcessor = (
  data: MessageProcessorPayload
): boolean => {
  if (data.config.adminIds.includes(data.message.author.id)) {
    if (data.message.content === kNotifyPrimalStormOn) {
      enabled.set(data.message.channel.id, data.message.channel);
      data.message.channel.send("Enabled Primal Storm tracking");
      return true;
    } else if (data.message.content === kNotifyPrimalStormOff) {
      enabled.delete(data.message.channel.id);
      data.message.channel.send("Disabled Primal Storm tracking");
      return true;
    }
  }

  return false;
};

export default processMessage;

schedule.scheduleJob("0 0 2-23/3 * * *", function () {
  enabled.forEach((channel) => channel.send("New Primal Storms available."));
});
