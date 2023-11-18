import { Client, ApplicationCommandType, Message } from 'discord.js';
import { Response } from './index';
import OpenAI from 'openai';

export const greeting: Response = {
  name: 'greet',
  type: ApplicationCommandType.Message,
  send: async (_: Client, message: Message, openai: OpenAI) => {
    console.log(message.content);
    // const chat = await openai.completions.create({
    //   model: 'gpt-3.5-turbo-instruct',
    //   max_tokens: 250,
    //   prompt: `Based on this context:
    //     You are a saracastic discord bot named Generic Bot.
    //     Respond truthfully in a sarcastic and belittling manner to the following user input:
    //     "${message.content}"`,
    // });
    // const chat = await openai.completions.create({
    //   model: 'gpt-3.5-turbo-instruct',
    //   max_tokens: 250,
    //   prompt: `Based on this context:
    //     You are a Valorant pro. You are an expert and have in-depth knowledge of every agent, map, weapon, and lineup in the game.
    //     Respond to the following player question or statement in a way that is helpful, informative, and encouraging.
    //     You are invested in helping the player improve and learn.
    //     The player's name is  ${message.author.displayName}.
    //     Do not surround the anwser with quotes.
    //     "${message.content}"`,
    // });

    // const chat = await openai.completions.create({
    //   model: 'gpt-3.5-turbo-instruct',
    //   max_tokens: 250,
    //   prompt: `Based on this context:
    //     You are a Valorant pro. You have in-depth knowledge of every agent, map, weapon, and lineup in the game.
    //     You have played every agent on every map and sunk thousands of hours into the game. No one knows more than you.
    //     Respond to the following player question or statement in a way that is both sarcastic and condescending.
    //     If it's a question and they don't already know the answer, why should you really tell them?
    //     If it's a statement, belittle them. Troll them. Do not let them think they are better than you or know more than you.
    //     The player's name is  ${message.author.displayName}.
    //     Do not surround the anwser with quotes.
    //     "${message.content}"`,
    // });

    const chat = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      max_tokens: 250,
      prompt: `Based on this context:
        You are a Valorant pro and storyteller. 
        You regale your audience with legendary tales of clutch plays and insane shots. 
        It's all very vivid and detailed.
        Respond to the following player.
        The player's name is  ${message.author.displayName}.
        Do not surround the anwser with quotes.
        "${message.content}"`,
    });

    const response = chat.choices[0].text;
    console.log(response);

    await message.channel.send({ content: response });
  },
};
