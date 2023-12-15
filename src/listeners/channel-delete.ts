import { Client, Events } from 'discord.js';
import { commands } from '../commands';
import { dbInit, pgConfig } from 'src/db/config/config';
import { Channel } from 'src/db/config/entities';

export const channelDeleteListener = (client: Client): void => {
  client.on(Events.ChannelDelete, async (channel) => {
    await pgConfig<Channel>('channels')
      .where({ channel_id: channel.id })
      .delete();
  });
};
