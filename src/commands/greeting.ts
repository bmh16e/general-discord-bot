import {
  CommandInteraction,
  Client,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} from 'discord.js';
import { Command } from './index';

export const greeting: Command = {
  name: 'greet',
  description: 'Says hello to the user',
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      description: 'True if you want to be greeted personally',
      name: 'personal',
      type: ApplicationCommandOptionType.Boolean,
    },
  ],
  execute: async (_: Client, interaction: CommandInteraction) => {
    const personal = interaction.options.get('personal')?.value;
    await interaction.followUp({ ephemeral: false, content: 'Hello!' });
    setTimeout(async () => {
      await interaction.followUp({
        ephemeral: false,
        content: 'Hello Again!',
      });
    }, 5000);
  },
};
