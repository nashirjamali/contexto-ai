import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export interface VectorMatch {
  documentId: string;
  chunkIndex: number;
  content: string;
  score: number;
}

export interface ChunkVector {
  chunkIndex: number;
  content: string;
  tokenCount: number;
  vector: number[];
}

@Injectable()
export class VectorSearchService implements OnModuleInit {
  private readonly logger = new Logger(VectorSearchService.name);
  private dimension = 4096;

  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    this.dimension = Number(
      this.configService.get<string>('EMBEDDING_DIMENSION') ?? '4096',
    );

    await this.dataSource.query('CREATE EXTENSION IF NOT EXISTS vector');
    await this.dataSource.query(
      'ALTER TABLE document_chunks DROP COLUMN IF EXISTS "pineconeVectorId"',
    );
    await this.dataSource.query(
      `ALTER TABLE document_chunks ADD COLUMN IF NOT EXISTS embedding vector(${this.dimension})`,
    );

    if (this.dimension <= 2000) {
      await this.dataSource.query(
        'CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding ON document_chunks USING hnsw (embedding vector_cosine_ops)',
      );
    } else {
      this.logger.warn(
        `Skipping HNSW index: pgvector supports at most 2000 dimensions (configured ${this.dimension}). Search uses sequential scan.`,
      );
    }

    this.logger.log(`pgvector ready (dimension ${this.dimension})`);
  }

  async saveChunks(documentId: string, chunks: ChunkVector[]): Promise<void> {
    await this.dataSource.query(
      'DELETE FROM document_chunks WHERE "documentId" = $1',
      [documentId],
    );

    for (const chunk of chunks) {
      await this.dataSource.query(
        `INSERT INTO document_chunks ("documentId", "chunkIndex", content, "tokenCount", embedding)
         VALUES ($1, $2, $3, $4, $5::vector)`,
        [
          documentId,
          chunk.chunkIndex,
          chunk.content,
          chunk.tokenCount,
          this.toVectorLiteral(chunk.vector),
        ],
      );
    }
  }

  async search(
    workspaceId: string,
    vector: number[],
    topK: number,
    documentId?: string,
  ): Promise<VectorMatch[]> {
    const rows: {
      documentId: string;
      chunkIndex: number;
      content: string;
      score: string;
    }[] = await this.dataSource.query(
      `SELECT
         dc."documentId" AS "documentId",
         dc."chunkIndex" AS "chunkIndex",
         dc.content AS content,
         1 - (dc.embedding <=> $1::vector) AS score
       FROM document_chunks dc
       INNER JOIN documents d ON d.id = dc."documentId"
       WHERE d."workspaceId" = $2
         AND dc.embedding IS NOT NULL
         AND ($3::uuid IS NULL OR dc."documentId" = $3::uuid)
       ORDER BY dc.embedding <=> $1::vector
       LIMIT $4`,
      [
        this.toVectorLiteral(vector),
        workspaceId,
        documentId ?? null,
        topK,
      ],
    );

    return rows.map((row) => ({
      documentId: row.documentId,
      chunkIndex: Number(row.chunkIndex),
      content: row.content,
      score: Number(row.score),
    }));
  }

  private toVectorLiteral(vector: number[]): string {
    return `[${vector.join(',')}]`;
  }
}
