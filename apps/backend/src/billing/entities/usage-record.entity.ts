import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsageType } from '../../common/enums/usage-type.enum';
import { Organization } from '../../organizations/entities/organization.entity';

@Entity('usage_records')
export class UsageRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @ManyToOne(() => Organization, (organization) => organization.usageRecords)
  organization: Organization;

  @Column({ type: 'enum', enum: UsageType })
  type: UsageType;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;
}
