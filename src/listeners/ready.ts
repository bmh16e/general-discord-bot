import { Client, Events } from 'discord.js';
import { commands } from '../commands';

export const ready = (client: Client): void => {
  client.on(Events.ClientReady, async () => {
    if (!client.user || !client.application) {
      return;
    }
    await client.application.commands.set(commands);

    console.log(`${client.user.username} is online`);
  });
};
