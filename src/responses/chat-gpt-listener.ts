import { Client, ApplicationCommandType, Message } from 'discord.js';
import { Response } from './index';
import OpenAI from 'openai';
import { pgConfig } from 'src/db/config/config';
import { Prompt } from 'src/db/config/entities';

export const chatGPTListener: Response = {
  name: 'chat-gpt-listener',
  type: ApplicationCommandType.Message,
  send: async (_: Client, message: Message, openai: OpenAI) => {
    const prompt = await pgConfig<Prompt>('prompts')
      .where({ channel_id: message.channelId })
      .first();

    if (!prompt) {
      return;
    }

    let userContextString = '';
    if (prompt.use_user_context) {
      userContextString = `You are talking to ${message.author.displayName}.`;
    }
    console.log(prompt.prompt_content.length);
    const chat = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      max_tokens: 250,
      prompt: `${prompt.prompt_content}. ${userContextString} ${message.content} Do not surround the anwser with quotes.`,
    });

    const response = chat.choices[0].text;

    await message.channel.send({ content: response });
  },
};
