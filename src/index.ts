import { Client } from 'discord.js';
import OpenAI from 'openai';
import { ready } from './listeners/ready';
import { interactionCreate } from './listeners/interactionCreate';
import { messageCreate } from './listeners/messageCreate';

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

console.log('Discord Token: ', DISCORD_TOKEN);
console.log('OpenAI Token: ', OPENAI_API_KEY);

const client = new Client({
  intents: ['GuildMessages', 'Guilds', 'MessageContent', 'GuildIntegrations'],
});

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

ready(client);
interactionCreate(client, openai);
messageCreate(client, openai);

client.login(DISCORD_TOKEN);
