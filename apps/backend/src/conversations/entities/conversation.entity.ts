import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Document } from '../../documents/entities/document.entity';
import { User } from '../../users/entities/user.entity';
import { Workspace } from '../../workspaces/entities/workspace.entity';
import { Message } from './message.entity';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  workspaceId: string;

  @ManyToOne(() => Workspace, (workspace) => workspace.conversations)
  workspace: Workspace;

  @Column({ nullable: true })
  documentId: string;

  @ManyToOne(() => Document, { nullable: true })
  document: Document;

  @Column({ nullable: true })
  createdBy: string;

  @ManyToOne(() => User, { nullable: true })
  creator: User;

  @Column({ default: false })
  isPublic: boolean;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;
}
