import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Membership } from '../../workspaces/entities/membership.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  passwordHash: string;

  @Column({ nullable: true })
  oauthProvider: string;

  @OneToMany(() => Membership, (membership) => membership.user)
  memberships: Membership[];

  @CreateDateColumn()
  createdAt: Date;
}
