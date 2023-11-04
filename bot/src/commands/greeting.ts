import { CommandInteraction, Client, ApplicationCommandType } from 'discord.js';
import { Command } from './index';

export const greeting: Command = {
  name: 'hello',
  description: 'Says hello to the user',
  type: ApplicationCommandType.ChatInput,
  options: [],
  execute: async (_: Client, interaction: CommandInteraction) => {
    await interaction.followUp({ ephemeral: true, content: 'Hello!' });
  },
};
