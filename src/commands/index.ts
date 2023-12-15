import {
  CommandInteraction,
  ChatInputApplicationCommandData,
  SlashCommandBuilder,
  Client,
  Interaction,
  PermissionsBitField,
  GuildMember,
} from 'discord.js';
import { greeting } from './greeting';
import { createPrompt } from './create-prompt';
import { deletePrompt } from './delete-prompt';

export interface Command extends ChatInputApplicationCommandData {
  execute: (client: Client, interaction: CommandInteraction) => void;
}

export const commands: Command[] = [greeting, createPrompt, deletePrompt];

export const hasRequiredPermissions = (interaction: CommandInteraction) => {
  const member = interaction.member;
  if (member && member instanceof GuildMember) {
    const hasPermissions = member.permissions.has(
      PermissionsBitField.Flags.ManageChannels,
      true,
    );
    return hasPermissions;
  } else {
    return false;
  }
};
