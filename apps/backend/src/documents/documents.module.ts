import { Module, forwardRef } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from '../conversations/entities/conversation.entity';
import { Message } from '../conversations/entities/message.entity';
import { PublicLink } from '../public-links/entities/public-link.entity';
import { RagModule } from '../rag/rag.module';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { documentUploadOptions } from './documents-upload.config';
import { DocumentChunk } from './entities/document-chunk.entity';
import { Document } from './entities/document.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Document,
      DocumentChunk,
      Conversation,
      Message,
      PublicLink,
    ]),
    MulterModule.register(documentUploadOptions),
    RagModule,
    forwardRef(() => WorkspacesModule),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
