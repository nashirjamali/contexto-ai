import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsModule } from '../documents/documents.module';
import { RagModule } from '../rag/rag.module';
import { PublicLink } from './entities/public-link.entity';
import { PublicLinksController } from './public-links.controller';
import { PublicLinksService } from './public-links.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PublicLink]),
    DocumentsModule,
    RagModule,
  ],
  controllers: [PublicLinksController],
  providers: [PublicLinksService],
})
export class PublicLinksModule {}
