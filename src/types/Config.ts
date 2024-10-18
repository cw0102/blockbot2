export interface FullConfig {
  /**
   * Discord Bot Admin User IDs
   */
  adminIds: string[];

  /**
   * The Discord bot token
   */
  discordToken: string;
}

export type Config = Omit<FullConfig, 'discordToken'>;
