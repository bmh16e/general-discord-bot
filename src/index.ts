import { Client } from 'discord.js';
import OpenAI from 'openai';
import { InteractionClient } from './classes/interaction';
import { MessageClient } from './classes/message';
import {
  channelDeleteListener,
  channelUpdateListener,
  ready,
} from './listeners';

const DISCORD_API_KEY = process.env.DISCORD_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

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
channelDeleteListener(client);
channelUpdateListener(client);

client.login(DISCORD_API_KEY);
