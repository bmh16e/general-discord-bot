import { CommandInteraction, Client, Interaction, Events } from 'discord.js';
import OpenAI from 'openai';
import { commands } from '../commands';

export const interactionCreate = (client: Client, _: OpenAI): void => {
  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
      await handleSlashCommand(client, interaction);
    }
  });
};

const handleSlashCommand = async (
  client: Client,
  interaction: CommandInteraction,
): Promise<void> => {
  const slashCommand = commands.find(
    (cmd) => cmd.name === interaction.commandName,
  );
  if (!slashCommand) {
    interaction.followUp({ content: 'An error has occurred' });
    return;
  }

  await interaction.deferReply();
  slashCommand.execute(client, interaction);
};
