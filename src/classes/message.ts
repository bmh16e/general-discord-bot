import { Client, Events, Message as DiscordMessage, Message } from 'discord.js';

import OpenAI from 'openai';
import { pgConfig } from 'src/db/config/config';
import { Server } from 'src/db/config/entities';
import { chatGPTListener } from 'src/responses';

export class MessageClient {
  openaiClient: OpenAI;
  discordClient: Client<boolean>;

  constructor(openaiClient: OpenAI, discordClient: Client<boolean>) {
    this.openaiClient = openaiClient;
    this.discordClient = discordClient;
  }

  messageListener(): void {
    this.discordClient.on(
      Events.MessageCreate,
      async (message: DiscordMessage) => {
        if (message.author.bot) return;
        await this.checkServer(message);
        await this.handleMessage(message);
      },
    );
  }

  async handleMessage(message: Message): Promise<void> {
    const response = chatGPTListener;

    response.send(this.discordClient, message, this.openaiClient);
  }

  // check if server exists in db and adds it if it doesn't exist
  private async checkServer(message: Message) {
    if (message.guildId) {
      const serverId = message.guildId;
      const existingId = await pgConfig<Server>('servers')
        .where({ server_id: serverId })
        .select('server_id')
        .first();

      // if server doesn't exist, add it to db
      if (!existingId) {
        await pgConfig<Server>('servers').insert({
          server_id: serverId,
          name: message.guild?.name,
        });
      }
    }
  }
}
