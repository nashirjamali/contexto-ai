import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MembershipRole } from '../../common/enums/membership-role.enum';
import { User } from '../../users/entities/user.entity';
import { Workspace } from './workspace.entity';

@Entity('memberships')
export class Membership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.memberships)
  user: User;

  @Column()
  workspaceId: string;

  @ManyToOne(() => Workspace, (workspace) => workspace.memberships)
  workspace: Workspace;

  @Column({ type: 'enum', enum: MembershipRole })
  role: MembershipRole;

  @CreateDateColumn()
  createdAt: Date;
}
