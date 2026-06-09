import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from '../documents/entities/document.entity';
import { LlmModule } from '../llm/llm.module';
import { VectorModule } from '../vector/vector.module';
import { RagIngestionService } from './rag-ingestion.service';
import { RagQueryService } from './rag-query.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document]),
    LlmModule,
    VectorModule,
  ],
  providers: [RagIngestionService, RagQueryService],
  exports: [RagIngestionService, RagQueryService],
})
export class RagModule {}
