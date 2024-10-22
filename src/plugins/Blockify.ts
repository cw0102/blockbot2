import type {
  MessageProcessor,
  MessageProcessorPayload,
} from '../types/MessageProcessor';

const enabled = new Set();

const kAutoBlockifyOn = '!autoblockify on';
const kAutoBlockifyOff = '!autoblockify off';
const kSingleMessage = '!blockify ';

const kReplaceText: Record<string, string> = {
  'up!': ':up:',
  cool: ':cool',
  free: ':free:',
  back: ':back:',
  'on!': ':on:',
  top: ':top:',
  soon: ':soon:',
  end: ':end:',
  new: ':new:',
  atm: ':atm:',
  sos: ':sos:',
  usa: ':flag_us:',
  mandy: ':mandymoore:',
  '0': ':zero:',
  '1': ':one:',
  '2': ':two:',
  '3': ':three:',
  '4': ':four:',
  '5': ':five:',
  '6': ':six:',
  '7': ':seven:',
  '8': ':eight:',
  '9': ':nine:',
  '?': ':question:',
  '!': ':exclamation:',
};

interface ReplaceTextResult {
  result: string;
  skip: number;
}

/**
 * Performs blockify commands to turn on/off blockify and blockifys messages
 * when the module is enabled.
 * @param {MessageProcessorPayload} payload The message processor payload
 * @return {boolean} If this module consumed the message
 */
const processMessage: MessageProcessor = (
  payload: MessageProcessorPayload,
): boolean => {
  const {config, message} = payload;
  if (config.adminIds.includes(message.author.id)) {
    if (message.content === kAutoBlockifyOn) {
      enabled.add(message.channel.id);
      message
        .delete()
        .then(msg => {
          msg.channel
            .send(blockify('Blocked'))
            .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
      return true;
    } else if (message.content === kAutoBlockifyOff) {
      enabled.delete(message.channel.id);
      message
        .delete()
        .then(msg => {
          msg.channel
            .send(blockify('Unblocked'))
            .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
      return true;
    }
  }

  // ignore other bot messages
  if (message.author.bot) {
    return false;
  }

  const processSingleMessage = message.content.startsWith(kSingleMessage);

  if (enabled.has(message.channel.id) || processSingleMessage) {
    message
      .delete()
      .then(msg => {
        const newMessage = `${msg.author}: ${
          processSingleMessage
            ? blockify(msg.content.slice(kSingleMessage.length))
            : blockify(msg.content)
        }`;
        message.channel.send(newMessage).catch(err => console.error(err));
      })
      .catch(console.error);
    return true;
  }

  return false;
};

export default processMessage;

/**
 * Replace certain text strings with a single emoji
 * @param {string} str The string to search
 * @param {number} position The 0-indexed position in the string to start at
 * @returns {ReplaceTextResult | null} An object containing the result, if found, else null
 */
function replaceTextEmoji(
  str: string,
  position: number,
): ReplaceTextResult | null {
  for (const key in kReplaceText) {
    if (nextCharactersAre(str, position, key)) {
      const replacement = kReplaceText[key];
      return {result: replacement, skip: key.length - 1};
    }
  }
  return null;
}

/**
 * Checks if the characters following `str[position]` are equal to `nextChars`
 * @param {string} str The string to search
 * @param {number} position The 0-indexed position in the string to start at
 * @param {string} nextChars The characters to search for
 * @return {boolean} Whether the text matches
 */
function nextCharactersAre(
  str: string,
  position: number,
  nextChars: string,
): boolean {
  return str.slice(position, position + nextChars.length) === nextChars;
}

/**
 * Determines if a string is entirely ASCII alphabet characters
 * @param {string} str The string to test
 * @return {boolean} Whether the string is entirely ASCII alphabet characters
 */
function isAlpha(str: string): boolean {
  return /^[A-Z]$/i.test(str);
}

/**
 * Determines if `pattern` starts at `pos` in a given `str`
 * @param {string} str The string to parse from
 * @param {number} pos The position of the string to start at
 * @param {string} pattern The regex pattern to match
 * @return {string} The match if it exists, else null
 */
function findNextPattern(str: string, pos: number, pattern: string): string {
  const regExPattern = RegExp(`^${pattern}`);
  const result = regExPattern.exec(str.slice(pos));
  if (result === null) {
    return '';
  }
  return result[0];
}

/**
 * Parses out a discord id from a string position
 * @param {string} str The string to parse from
 * @param {number} pos The position of the string to start at
 * @return {string} The full discord ID (or null if it is not a valid ID)
 */
function getDiscordID(str: string, pos: number): string {
  return findNextPattern(str, pos, '<@[\\d]+>');
}

/**
 * Parses out a discord custom emoji from a string position
 * @param {string} str The string to parse from
 * @param {number} pos The position of the string to start at
 * @return {string} The full emoji id (or null if it is not a valid ID)
 */
function getDiscordEmoji(str: string, pos: number): string {
  return findNextPattern(str, pos, '<:[\\w~]+:[\\d]+>');
}

/**
 * Parses out regular emoji from a string position
 * https://thekevinscott.com/emojis-in-javascript/
 * @param {string} str The string to parse from
 * @param {number} pos The position of the string to start at
 * @return {string} The emoji
 */
function getEmoji(str: string, pos: number): string {
  return findNextPattern(
    str,
    pos,
    '(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c\ude32-\ude3a]|[\ud83c\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])',
  );
}

/**
 * Turn a text message into regional block letters
 * @param {string} text The text to blockify
 * @return {string} The blockified string
 */
function blockify(text: string): string {
  let out = '';
  let skip = 0;
  for (let pos = 0; pos < text.length; pos++) {
    if (skip > 0) {
      pos += skip - 1;
      skip = 0;
      continue;
    }

    const char = text[pos];

    const replaceTextResult = replaceTextEmoji(text, pos);
    if (replaceTextResult !== null) {
      out += replaceTextResult.result;
      skip = replaceTextResult.skip;
    } else if (isAlpha(char)) {
      out += `:regional_indicator_${char.toLowerCase()}:`;
    } else if (nextCharactersAre(text, pos, '<@')) {
      const idStr = getDiscordID(text, pos);
      if (idStr) {
        out += idStr;
        skip = idStr.length;
      } else {
        out += char;
      }
    } else if (nextCharactersAre(text, pos, '<:')) {
      const customEmojiStr = getDiscordEmoji(text, pos);
      if (customEmojiStr) {
        out += customEmojiStr;
        skip = customEmojiStr.length;
      } else {
        out += char;
      }
    } else {
      const emoji = getEmoji(text, pos);
      if (emoji !== null) {
        out += emoji;
        skip = emoji.length;
      } else {
        out += char;
      }
    }

    out += ' ';
  }

  return out.slice(0, out.length - 1);
}
