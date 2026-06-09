import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Plan } from '../../common/enums/plan.enum';
import { Workspace } from '../../workspaces/entities/workspace.entity';
import { UsageRecord } from '../../billing/entities/usage-record.entity';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  stripeCustomerId: string;

  @Column({ type: 'enum', enum: Plan, default: Plan.FREE })
  plan: Plan;

  @OneToMany(() => Workspace, (workspace) => workspace.organization)
  workspaces: Workspace[];

  @OneToMany(() => UsageRecord, (record) => record.organization)
  usageRecords: UsageRecord[];

  @CreateDateColumn()
  createdAt: Date;
}
