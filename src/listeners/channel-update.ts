import { ChannelType, Client, Events } from 'discord.js';
import { pgConfig } from 'src/db/config/config';
import { Channel } from 'src/db/config/entities';

export const channelUpdateListener = (client: Client): void => {
  client.on(Events.ChannelUpdate, async (_, newChannel) => {
    if (newChannel.type === ChannelType.GuildText) {
      console.log('updating channel');
      console.log(newChannel);
      await pgConfig<Channel>('channels')
        .where({ channel_id: newChannel.id })
        .update({ name: newChannel.name });
    }
  });
};
