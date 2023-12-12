import { Client, Events } from 'discord.js';
import { commands } from '../commands';
import { dbInit } from 'src/db/config/config';

export const ready = (client: Client): void => {
  client.on(Events.ClientReady, async () => {
    if (!client.user || !client.application) {
      return;
    }

    await dbInit();
    await client.application.commands.set(commands);

    console.log(`${client.user.username} is online`);
    console.log(
      'The following commands are registered: ',
      commands.map((cmd) => cmd.name),
    );
  });
};
