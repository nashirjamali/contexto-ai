import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';
import { Membership } from './membership.entity';
import { Document } from '../../documents/entities/document.entity';
import { Conversation } from '../../conversations/entities/conversation.entity';

@Entity('workspaces')
export class Workspace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @ManyToOne(() => Organization, (organization) => organization.workspaces)
  organization: Organization;

  @Column()
  name: string;

  @OneToMany(() => Membership, (membership) => membership.workspace)
  memberships: Membership[];

  @OneToMany(() => Document, (document) => document.workspace)
  documents: Document[];

  @OneToMany(() => Conversation, (conversation) => conversation.workspace)
  conversations: Conversation[];

  @CreateDateColumn()
  createdAt: Date;
}
