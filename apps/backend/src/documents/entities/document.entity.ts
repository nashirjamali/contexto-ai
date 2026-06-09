import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DocumentStatus } from '../../common/enums/document-status.enum';
import { User } from '../../users/entities/user.entity';
import { Workspace } from '../../workspaces/entities/workspace.entity';
import { DocumentChunk } from './document-chunk.entity';
import { PublicLink } from '../../public-links/entities/public-link.entity';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  workspaceId: string;

  @ManyToOne(() => Workspace, (workspace) => workspace.documents)
  workspace: Workspace;

  @Column()
  uploadedBy: string;

  @ManyToOne(() => User)
  uploader: User;

  @Column()
  title: string;

  @Column()
  fileUrl: string;

  @Column({ type: 'int' })
  fileSize: number;

  @Column({ type: 'enum', enum: DocumentStatus, default: DocumentStatus.UPLOADING })
  status: DocumentStatus;

  @Column({ type: 'int', nullable: true })
  pageCount: number;

  @OneToMany(() => DocumentChunk, (chunk) => chunk.document)
  chunks: DocumentChunk[];

  @OneToMany(() => PublicLink, (link) => link.document)
  publicLinks: PublicLink[];

  @CreateDateColumn()
  createdAt: Date;
}
