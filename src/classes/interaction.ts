import {
  Client,
  Events,
  Interaction as DiscordInteraction,
  Interaction,
  CommandInteraction,
} from 'discord.js';
import OpenAI from 'openai';
import { commands } from 'src/commands';
import { pgConfig } from 'src/db/config/config';
import { Server } from 'src/db/config/entities';

export class InteractionClient {
  private openaiClient: OpenAI;
  private discordClient: Client<boolean>;

  constructor(openaiClient: OpenAI, discordClient: Client<boolean>) {
    console.log('interaction client created');
    this.openaiClient = openaiClient;
    this.discordClient = discordClient;
  }

  interactionListener(): void {
    this.discordClient.on(
      Events.InteractionCreate,
      async (interaction: DiscordInteraction) => {
        if (interaction.isChatInputCommand()) {
          await this.checkServer(interaction);
          await this.handleCommand(interaction);
        }
      },
    );
  }

  private async handleCommand(interaction: CommandInteraction): Promise<void> {
    const slashCommand = commands.find(
      (cmd) => cmd.name === interaction.commandName,
    );
    if (!slashCommand) {
      interaction.followUp({ content: 'An error has occurred' });
      return;
    }

    await interaction.deferReply();
    slashCommand.execute(this.discordClient, this.openaiClient, interaction);
  }

  // check if server exists in db and adds it if it doesn't exist
  private async checkServer(interaction: Interaction) {
    if (interaction.guildId) {
      const serverId = interaction.guildId;
      const existingId = await pgConfig<Server>('servers')
        .where({ server_id: serverId })
        .select('server_id')
        .first();

      // if server doesn't exist, add it to db
      if (!existingId) {
        await pgConfig<Server>('servers').insert({
          server_id: serverId,
          name: interaction.guild?.name,
        });
      }
    }
  }
}
