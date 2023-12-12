import { Client, Message, MessageApplicationCommandData } from 'discord.js';
import OpenAI from 'openai';

export interface Response extends MessageApplicationCommandData {
  send: (client: Client, message: Message, openai: OpenAI) => void;
}

export * from './chat-gpt-listener';
