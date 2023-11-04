import { Client, Events, Message } from 'discord.js';
import OpenAI from 'openai';
import { greeting } from 'src/responses/greeting';

export const messageCreate = (client: Client, openai: OpenAI): void => {
  client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot) return;
    console.log(message.content);

    await handleMessage(client, message, openai);
  });
};

const handleMessage = async (
  client: Client,
  message: Message,
  openai: OpenAI,
) => {
  // handle user message here
  const response = greeting;

  response.send(client, message, openai);
};
