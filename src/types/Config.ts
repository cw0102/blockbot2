export interface Config {
    /**
     * Discord Bot Admin User IDs
     */
    adminIds: Array<string>;

    /**
     * The Discord bot token
     */
    discordToken: string;
}

export type ModuleConfig = Omit<Config, "discordToken">;
