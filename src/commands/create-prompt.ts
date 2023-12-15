import {
  CommandInteraction,
  Client,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} from 'discord.js';
import { Command, hasRequiredPermissions } from './index';
import { pgConfig } from 'src/db/config/config';
import { Channel, Prompt } from 'src/db/config/entities';

export const createPrompt: Command = {
  name: 'create-prompt',
  description:
    'Creates a new GPT prompt to set behavior in the channel for the bot',
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'content',
      description: 'The content of the prompt',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'use_user_context',
      description:
        'Controls whether the responses will be personalized to the user',
      type: ApplicationCommandOptionType.Boolean,
      required: false,
    },
  ],

  execute: async (_: Client, interaction: CommandInteraction) => {
    if (hasRequiredPermissions(interaction)) {
      const channelId = interaction.channelId;
      const content = interaction.options.get('content')?.value as string;
      const useUserContext = interaction.options.get('use_user_context')
        ?.value as boolean;

      if (content.length > 2000) {
        await interaction.followUp({
          ephemeral: true,
          content:
            "That prompt is too long! Please keep it under 2000 characters. So the matrix doesn't break or something.",
        });
        return;
      }

      // check if channel exists in db and add it if it doesn't exist
      const existingChannel = await pgConfig<Channel>('channels')
        .where({ channel_id: channelId })
        .first();

      // if channel doesn't exist, add it to db
      if (!existingChannel) {
        // get channel name
        const channelName =
          interaction.guild?.channels.cache.get(channelId)?.name;
        await pgConfig<Channel>('channels').insert({
          channel_id: channelId,
          server_id: interaction.guildId as string,
          name: channelName,
        });

        // If the channel doesn't exist, the prompt doesn't exist either so we can immediately create it
        await pgConfig<Prompt>('prompts').insert({
          channel_id: channelId,
          prompt_content: content,
          use_user_context: useUserContext,
        });
        await interaction.followUp({
          ephemeral: false,
          content: 'New Channel Prompt Set',
        });
      } else {
        // check if prompt already exists for this channel
        const currentPrompt = await pgConfig<Prompt>('prompts')
          .where({ channel_id: channelId })
          .first();

        // if prompt exists,
        if (currentPrompt) {
          await interaction.followUp({
            ephemeral: true,
            content: `A prompt already exists for this channel. 
          You must remove it before creating a new one. You can remove the existing prompt with /delete-prompt command.`,
          });
        } else {
          await pgConfig<Prompt>('prompts').insert({
            channel_id: channelId,
            prompt_content: content,
            use_user_context: useUserContext,
          });
          await interaction.followUp({
            ephemeral: false,
            content: 'New Channel Prompt Set',
          });
        }
      }
    } else {
      await interaction.followUp({
        ephemeral: true,
        content:
          'Sorry, you do not have the required permissions to use this command.',
      });
    }
  },
};
