import {
  CommandInteraction,
  ChatInputApplicationCommandData,
  SlashCommandBuilder,
  Client,
  Interaction,
} from 'discord.js';
import { greeting } from './greeting';
import { createPrompt } from './create-prompt';
import { deletePrompt } from './delete-prompt';

export interface Command extends ChatInputApplicationCommandData {
  execute: (client: Client, interaction: CommandInteraction) => void;
}

export interface CommandBuilder {
  data: SlashCommandBuilder;
  execute: (client: Client, interaction: CommandInteraction) => void;
}

export const commands: Command[] = [greeting, createPrompt, deletePrompt];
