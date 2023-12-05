import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Channel } from './channel.ts';

@Entity()
export class Prompt {
  @PrimaryKey()
  id!: string;

  @Property()
  name!: string;

  @OneToMany(() => Channel, (channel) => channel.prompt)
  channels!: Collection<Channel>;
}
