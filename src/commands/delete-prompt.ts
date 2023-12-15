import { CommandInteraction, Client, ApplicationCommandType } from 'discord.js';
import { Command, hasRequiredPermissions } from './index';
import { pgConfig } from 'src/db/config/config';
import { Prompt } from 'src/db/config/entities';
import OpenAI from 'openai';

export const deletePrompt: Command = {
  name: 'delete-prompt',
  description:
    'Deletes the GPT prompt in the channel, allowing a new one to be created',
  type: ApplicationCommandType.ChatInput,

  execute: async (_: Client, __: OpenAI, interaction: CommandInteraction) => {
    if (hasRequiredPermissions(interaction)) {
      const channelId = interaction.channelId;
      await pgConfig<Prompt>('prompts')
        .where({ channel_id: channelId })
        .delete();
      await interaction.followUp({
        ephemeral: true,
        content:
          'Channel prompt has been removed and you are now free to create a new one.',
      });
    } else {
      await interaction.followUp({
        ephemeral: true,
        content: 'You do not have permission to use this command.',
      });
    }
  },
};
