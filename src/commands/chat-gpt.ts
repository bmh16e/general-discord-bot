import {
  CommandInteraction,
  Client,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} from 'discord.js';
import { Command } from './index';
import OpenAI from 'openai';

export const chatGPT: Command = {
  name: 'chat-gpt',
  description: 'Pass a message to the GPT bot to get a response.',
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      description: 'Input to pass to the GPT bot',
      name: 'input',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  execute: async (
    _: Client,
    openaiClient: OpenAI,
    interaction: CommandInteraction,
  ) => {
    const input = interaction.options.get('input')?.value;

    const chat = await openaiClient.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      max_tokens: 250,
      prompt: `${input}`,
    });
    const response = chat.choices[0].text;

    await interaction.followUp({ ephemeral: false, content: response });
  },
};
