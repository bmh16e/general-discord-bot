import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
// import { Server } from './server.ts';

@Entity()
export class Channel {
  @PrimaryKey()
  id!: string;

  @Property()
  name!: string;

  @ManyToOne(() => 'Server', { nullable: false })
  server!: 'Server';

  @ManyToOne(() => 'Prompt', { nullable: false })
  prompt!: 'Prompt';
}
