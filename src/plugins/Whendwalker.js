import {Message} from 'discord.js';

const kWhendwalker = '!whendwalker';
const kWhenLegend = '!whenlegendtitle';

/**
 * Post the time until endwalker launch
 * @param {Message} message The current message to process
 * @return {boolean} If this module consumed the message
 */
export default function processMessage(message) {
  if (message.content === kWhendwalker) {
    message.channel.send(timeStringUntilEndwalker());
    return true;
  } else if (message.content === kWhenLegend) {
    message.channel.send('Just a few more pulls...');
    return true;
  }

  return false;
}

const kSecondInMs = 1000;
const kMinuteInMs = kSecondInMs * 60;
const kHourInMs = kMinuteInMs * 60;
const kDayInMs = kHourInMs * 24;

/**
 * Gets the time until Endwalker release
 * @return {string} A list of time until endwalker.
 */
function timeStringUntilEndwalker() {
  let result = new Date('2021-12-03T01:00:00.000-08:00') - Date.now();
  const days = Math.floor(result / kDayInMs);
  result = result % kDayInMs;
  const hours = Math.floor(result / kHourInMs);
  result = result % kHourInMs;
  const minutes = Math.floor(result / kMinuteInMs);
  result = result % kMinuteInMs;
  const seconds = Math.floor(result / kSecondInMs);
  return `Time until Endwalker (EA): ${days} day${days != 1 ? 's' : ''} | ${hours} hour${hours != 1 ? 's' : ''} | ${minutes} minute${minutes != 1 ? 's' : ''} | ${seconds} second${seconds != 1 ? 's' : ''}`;
}
