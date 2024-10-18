import type {
  MessageProcessor,
  MessageProcessorPayload,
} from '../types/MessageProcessor';

const kWhendwalker = '!whendwalker';
const kWhenLegend = '!whenlegendtitle';
const kWhenDawntrail = '!whendawntrail';
const kWhenRaid = '!whenraid';

/**
 * Post the time until endwalker launch
 * @param {MessageProcessorPayload} payload The message processor payload
 * @return {boolean} If this module consumed the message
 */
const processMessage: MessageProcessor = (
    data: MessageProcessorPayload,
): boolean => {
  if (data.message.content === kWhendwalker) {
    data.message.channel.send(timeStringUntilEndwalker());
    return true;
  } else if (data.message.content === kWhenLegend) {
    data.message.channel.send('Just a few more pulls...');
    return true;
  } else if (data.message.content === kWhenDawntrail) {
    data.message.channel.send(timeStringUntilDawntrail());
    return true;
  } else if (data.message.content === kWhenRaid) {
    data.message.channel.send('Just need 8 people, should be easy right?');
    return true;
  }

  return false;
};

export default processMessage;

const kSecondInMs = 1000;
const kMinuteInMs = kSecondInMs * 60;
const kHourInMs = kMinuteInMs * 60;
const kDayInMs = kHourInMs * 24;

/**
 * @param date The date to measure the time difference from
 * @return Millisecond difference from the current date to now
 */
function timeDiffToNow(date: Date) {
  return date.valueOf() - Date.now();
}

/**
 * @param text The name of the event to use in the output string
 * @param date The date of the event
 * @return A string with the time until the event
 */
function printTimeUntil(text: string, date: Date) {
  let result = timeDiffToNow(date);
  if (result < 0) {
    return `${text} is out!`;
  }

  const days = Math.floor(result / kDayInMs);
  result = result % kDayInMs;
  const hours = Math.floor(result / kHourInMs);
  result = result % kHourInMs;
  const minutes = Math.floor(result / kMinuteInMs);
  result = result % kMinuteInMs;
  const seconds = Math.floor(result / kSecondInMs);

  return `Time until ${text} (${date.toLocaleDateString()}): ${days} day${
    days != 1 ? 's' : ''
  } | ${hours} hour${hours != 1 ? 's' : ''} | ${minutes} minute${
    minutes != 1 ? 's' : ''
  } | ${seconds} second${seconds != 1 ? 's' : ''}`;
}

/**
 * Gets the time until Endwalker release
 * @return {string} A string of the time until Endwalker.
 */
function timeStringUntilEndwalker(): string {
  return printTimeUntil('Endwalker', new Date('2021-12-03T01:00:00.000-08:00'));
}

/**
 * Gets the time until Dawntrail release
 * @return {string} A string of the time until Dawntrail.
 */
function timeStringUntilDawntrail(): string {
  return printTimeUntil('Dawntrail', new Date('2024-06-28T02:00:00.000-07:00'));
}
