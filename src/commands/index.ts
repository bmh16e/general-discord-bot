import {
  CommandInteraction,
  ChatInputApplicationCommandData,
  Client,
  PermissionsBitField,
  GuildMember,
} from 'discord.js';
import { chatGPT } from './chat-gpt';
import { createPrompt } from './create-prompt';
import { deletePrompt } from './delete-prompt';
import OpenAI from 'openai';

export interface Command extends ChatInputApplicationCommandData {
  execute: (
    client: Client,
    openaiClient: OpenAI,
    interaction: CommandInteraction,
  ) => void;
}

export const commands: Command[] = [chatGPT, createPrompt, deletePrompt];

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
