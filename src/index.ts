import { Client } from 'discord.js';
import OpenAI from 'openai';
import { ready } from './listeners/ready';
import { InteractionClient } from './classes/interaction';
import { MessageClient } from './classes/message';

const DISCORD_API_KEY = process.env.DISCORD_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

console.log('Discord Token: ', DISCORD_API_KEY);
console.log('OpenAI Token: ', OPENAI_API_KEY);

const client = new Client({
  intents: ['GuildMessages', 'Guilds', 'MessageContent', 'GuildIntegrations'],
});
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const interactionClient = new InteractionClient(openai, client);
const messageClient = new MessageClient(openai, client);

ready(client);
interactionClient.interactionListener();
messageClient.messageListener();

client.login(DISCORD_API_KEY);
