import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Document } from '../../documents/entities/document.entity';

@Entity('public_links')
export class PublicLink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  documentId: string;

  @ManyToOne(() => Document, (document) => document.publicLinks)
  document: Document;

  @Column({ unique: true })
  slug: string;

  @Column({ default: true })
  enabled: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
