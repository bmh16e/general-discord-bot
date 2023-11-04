import {
  CommandInteraction,
  ChatInputApplicationCommandData,
  Client,
} from 'discord.js';
import { greeting } from './greeting';

export interface Command extends ChatInputApplicationCommandData {
  execute: (client: Client, interaction: CommandInteraction) => void;
}

export const commands: Command[] = [greeting];
